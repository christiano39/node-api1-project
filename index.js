const express = require('express');
const shortid = require('shortid');

const server = express();

server.use(express.json());

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
});

server.get('/api/users', (req, res) => {
    res.status(200).json(users);
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(usr => usr.id === id);

    if (!user){
        res.status(404).json({ message: "The user with the specified ID does not exist" });
    }

    res.status(200).json(user);
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(usr => usr.id === id);

    if (!user){
        res.status(404).json({ message: "The user with the specified ID does not exist" });
    }

    users = users.filter(usr => usr.id !== id);
    res.status(200).json({ message: "User deleted", user });
});

server.put('/api/users/:id', (req, res) => {
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
});

const port = 8000;
server.listen(port, () => console.log(`server running on port ${port}`));