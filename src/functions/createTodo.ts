import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4, validate } from 'uuid';
import { document } from '../utils/dynamodbClient';

interface ICreateTodo {
    title: string;
    deadline: string;
}

const error = (message: string) => {
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: message
        })
    };
}

export const handle: APIGatewayProxyHandler = async (event) => {
    const { userid } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

    const date = new Date(deadline);

    if(!validate(userid)){
        return error('Invalid id user!');
    }

    if(!title) {
        return error('Invalid title!');
    }

    if(!deadline || isNaN(date.getTime()) || date.toISOString().split('T')[0] !== deadline) {
        return error('Invalid deadline!');
    }    

    const idTodo = uuidV4();

    await document.put({
        TableName: 'todos',
        Item: {
            id: idTodo,
            user_id: userid,
            title,
            done: false,
            deadline: `${new Date(deadline)}`
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'Todo created!'
        })
    };
}