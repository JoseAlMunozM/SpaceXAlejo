import json
import boto3
import urllib.request
import os

TABLE = os.environ["DYNAMODB_TABLE"]
dynamo = boto3.resource("dynamodb")
table = dynamo.Table(TABLE)

SPACE_X_API = "https://api.spacexdata.com/v4"


# ------------------------------------------------------------
# Función para obtener nombre real, descripción e imágenes
# ------------------------------------------------------------
def get_rocket_data(rocket_id):
    try:
        url = f"{SPACE_X_API}/rockets/{rocket_id}"
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())

        return {
            "rocket_name": data.get("name", rocket_id),
            "rocket_description": data.get("description", None),
            "rocket_images": data.get("flickr_images", [])
        }

    except Exception as e:
        print("Error obteniendo rocket:", e)
        return {
            "rocket_name": rocket_id,
            "rocket_description": None,
            "rocket_images": []
        }


def lambda_handler(event, context):

    # Solo EventBridge llama esta Lambda → NO API Gateway → NO CORS
    print("INICIANDO IMPORTACIÓN DE DATOS…")

    try:
        launches_url = f"{SPACE_X_API}/launches"
        with urllib.request.urlopen(launches_url) as response:
            launches = json.loads(response.read().decode())

        count = 0

        for launch in launches:
            rocket_id = launch.get("rocket")
            rocket_data = get_rocket_data(rocket_id)

            item = {
                "id": launch.get("id"),
                "mission_name": launch.get("name"),
                "launch_date": launch.get("date_utc"),

                "rocket_id": rocket_id,
                "rocket_name": rocket_data["rocket_name"],
                "rocket_description": rocket_data["rocket_description"],
                "rocket_images": rocket_data["rocket_images"],

                "success": str(launch.get("success")),
                "details": launch.get("details"),
            }

            table.put_item(Item=item)
            count += 1

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Importación SpaceX OK (enriquecidos)",
                "items_written": count
            })
        }

    except Exception as e:
        print("ERROR EN IMPORTACIÓN:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
