import json
import boto3
import os

TABLE = os.environ["DYNAMODB_TABLE"]
dynamo = boto3.resource("dynamodb")
table = dynamo.Table(TABLE)


def lambda_handler(event, context):

    # CORS para el frontend
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS"
    }

    # OPTIONS preflight
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }

    # GET normal
    try:
        items = table.scan().get("Items", [])

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "message": "Consulta exitosa",
                "items_written": len(items),  
                "launches": items
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }
