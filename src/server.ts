import app from './app';
import http from 'http';

const server = http.createServer(app);
const PORT:number = Number(process.env.PORT) || 5000;

server.listen(PORT, ()=> {
    console.log(`Server successfully running on port ${PORT}`);
})