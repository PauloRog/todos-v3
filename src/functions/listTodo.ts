import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from '../utils/dynamodbClient';

export const handle: APIGatewayProxyHandler = async (event) => {
    const { userid } = event.pathParameters;

    const response = await document.scan({
        TableName: 'todos',
        FilterExpression: 'user_id = :id',
        ExpressionAttributeValues: {
            ':id': userid
        }
    }).promise();

    const todos = response.Items.map((todo) => {
        return {
            id: todo.id,
            user_id: todo.user_id,
            title: todo.title,
            done: todo.done,
            deadline: new Date(todo.deadline).toISOString().split('T')[0]
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify(todos)
    };
}