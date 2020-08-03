const express = require('express');
const shortid = require('shortid');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());

let users = [
    {
        id: shortid.generate(),
        name: "Christian Arneson",
        bio: "Just a guy"
    },
    {
        id: shortid.generate(),
        name: "Cameron Miller",
        bio: "A different guy"
    },
    {
        id: shortid.generate(),
        name: "Jim McJimothy",
        bio: "Likes long walks on the beach"
    },
    {
        id: shortid.generate(),
        name: "Jake Jakoby",
        bio: "Likes short walks on the beach"
    }
];

server.post('/api/users', (req, res) => {
    try {
        if (!req.body.name || !req.body.bio){
            res.status(400).json({ errorMessage: "Please provide name and bio for the user" });
        }
    
        const newUser = {
            id: shortid.generate(),
            name: req.body.name,
            bio: req.body.bio
        };
        users.push(newUser);
    
        res.status(201).json(newUser);
    }catch{
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
    }
});

server.get('/api/users', (req, res) => {
    try {
        res.status(200).json(users);
    }catch {
        res.status(500).json({ errorMessage: "The users information could not be retrieved" });
    }
});

server.get('/api/users/:id', (req, res) => {
    try {
        const id = req.params.id;
        const user = users.find(usr => usr.id === id);

        if (!user){
            res.status(404).json({ message: "The user with the specified ID does not exist" });
        }

        res.status(200).json(user);
    } catch {
        res.status(500).json({ errorMessage: "The user information could not be retrieved" });
    }
});

server.delete('/api/users/:id', (req, res) => {
    try {
        const id = req.params.id;
        const user = users.find(usr => usr.id === id);

        if (!user){
            res.status(404).json({ message: "The user with the specified ID does not exist" });
        }

        users = users.filter(usr => usr.id !== id);
        res.status(200).json({ message: "User deleted", user });
    } catch {
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
});

server.put('/api/users/:id', (req, res) => {
    try {
        const id = req.params.id;
        const user = users.find(usr => usr.id === id);

        if (!user){
            res.status(404).json({ message: "The user with the specified ID does not exist" });
        }else if (!req.body.name || !req.body.bio) {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user" });
        }

        users = users.map(usr => {
            if (usr.id === id){
                return {
                    id,
                    name: req.body.name,
                    bio: req.body.bio
                }
            }else {
                return usr;
            }
        });

        res.status(200).json({ message: "User updated", user: { id, name: req.body.name, bio: req.body.bio } })
    } catch {
        res.status(500).json({ errorMessage: "The user information could not be modified" });
    }
});

const port = 8000;
server.listen(port, () => console.log(`server running on port ${port}`));