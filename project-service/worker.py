import pika
import json
import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from app.models import Project, TeamMember


def callback(ch, method, properties, body):
    try:
        event = json.loads(body)
        event_type = event.get("type")
        data = event.get("data", {})
        project_id = data.get("project_id")

        if not project_id:
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return

        if event_type == "join_request_update":
            user_id = data.get("user_id")
            status = data.get("status")
            if status == "accepted" and user_id:
                TeamMember.objects.get_or_create(
                    project_id=project_id,
                    user_id=user_id,
                    defaults={"role": "developer"}
                )
                print(f"User {user_id} added to project {project_id} as developer.")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return

        try:
            project = Project.objects.get(pk=project_id)
            if event_type == "upvote":
                project.upvote_count += 1
                project.save()
                print(f"Upvote added to project {project_id}. New count: {project.upvote_count}")
            elif event_type == "upvote_removed":
                project.upvote_count = max(0, project.upvote_count - 1)
                project.save()
                print(f"Upvote removed from project {project_id}. New count: {project.upvote_count}")
        except Project.DoesNotExist:
            print(f"Project {project_id} not found.")

        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        print(f"Error processing message: {e}")
        ch.basic_ack(delivery_tag=method.delivery_tag)


def start_worker():
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=os.environ.get("RABBITMQ_HOST", "localhost"),
                    credentials=pika.PlainCredentials(
                        os.environ.get("RABBITMQ_USER", "guest"),
                        os.environ.get("RABBITMQ_PASS", "guest"),
                    )
                )
            )
            channel = connection.channel()
            channel.exchange_declare(exchange='events', exchange_type='fanout', durable=True)
            result = channel.queue_declare(queue="project_service_events", durable=True)
            queue_name = result.method.queue
            channel.queue_bind(exchange='events', queue=queue_name)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue=queue_name, on_message_callback=callback)
            print("Project Service Worker started. Waiting for messages...")
            channel.start_consuming()
        except Exception as e:
            print(f"Connection failed: {e}. Retrying in 5 seconds...")
            import time
            time.sleep(5)


if __name__ == "__main__":
    start_worker()
