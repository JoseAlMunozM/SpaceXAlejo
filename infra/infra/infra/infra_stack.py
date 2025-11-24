from aws_cdk import (
    Stack,
    Duration,
    RemovalPolicy,
    aws_dynamodb as dynamodb,
    aws_lambda as lambda_,
    aws_events as events,
    aws_events_targets as targets,
    aws_apigateway as apigateway
)
from constructs import Construct


class InfraStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 1. DynamoDB Table
        self.table = dynamodb.Table(
            self,
            "SpaceXLaunchesTable",
            partition_key=dynamodb.Attribute(
                name="id",
                type=dynamodb.AttributeType.STRING
            ),
            removal_policy=RemovalPolicy.DESTROY  # SOLO PARA DESARROLLO
        )

        # 2. Lambda Function
        self.lambda_fn = lambda_.Function(
            self,
            "SpaceXLambda",
            runtime=lambda_.Runtime.PYTHON_3_10,
            handler="lambda_function.lambda_handler",
            code=lambda_.Code.from_asset("../lambda"),
            timeout=Duration.seconds(30),
            environment={
                "DYNAMODB_TABLE": self.table.table_name
            }
        )

        # Permiso Lambda -> DynamoDB
        self.table.grant_read_write_data(self.lambda_fn)

        # 3. EventBridge rule: Every 6 hours
        events.Rule(
            self,
            "SpaceXScheduleRule",
            schedule=events.Schedule.rate(Duration.hours(6)),
            targets=[targets.LambdaFunction(self.lambda_fn)]
        )

        # 4. API Gateway for manual invocation
        api = apigateway.LambdaRestApi(
            self,
            "SpaceXApi",
            handler=self.lambda_fn,
            proxy=True,
            deploy_options=apigateway.StageOptions(stage_name="prod")
        )
