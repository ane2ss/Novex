import pika
import json
import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from app.models import Notification


def get_message(event_type, data):
    if event_type == "upvote":
        return f"Someone upvoted your project!", data.get("project_id")
    elif event_type == "comment":
        return f"Someone commented on your project!", data.get("project_id")
    elif event_type == "join_request":
        return f"Someone wants to join your project!", data.get("project_id")
    elif event_type == "join_request_update":
        s = data.get("status")
        return f"Your join request was {s}!", data.get("project_id")
    return "You have a new notification.", None


def callback(ch, method, properties, body):
    try:
        event = json.loads(body)
        event_type = event.get("type")
        data = event.get("data", {})

        if event_type == "upvote":
            target_user_id = data.get("project_owner_id") or data.get("user_id")
        elif event_type == "comment":
            target_user_id = data.get("project_owner_id") or data.get("user_id")
        elif event_type == "join_request":
            target_user_id = data.get("project_owner_id")
        elif event_type == "join_request_update":
            target_user_id = data.get("user_id")
        else:
            target_user_id = None

        if target_user_id:
            message, project_id = get_message(event_type, data)
            Notification.objects.create(
                user_id=target_user_id,
                type=event_type,
                message=message,
                project_id=project_id,
            )
            print(f"Notification created: {event_type} for user {target_user_id}")

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
            channel.queue_declare(queue="notifications", durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue="notifications", on_message_callback=callback)
            print("Worker started. Waiting for messages...")
            channel.start_consuming()
        except Exception as e:
            print(f"Connection failed: {e}. Retrying in 5 seconds...")
            import time
            time.sleep(5)


if __name__ == "__main__":
    start_worker()