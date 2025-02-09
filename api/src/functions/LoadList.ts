import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Task } from "../types";

const dummyTasks: Task[] = [
    { id: "1", title: "Task 1", done: false },
    { id: "2", title: "Task 2", done: true },
    { id: "3", title: "Task 3", done: false },
];

export async function LoadList(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return { body: JSON.stringify(dummyTasks) };
};

app.http('LoadList', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: LoadList
});