# CTFd API
A simple, typed client for the CTFd API.

### Installing
```bash
npm i @b01lers/ctfd-api
```

### Usage
<!-- TODO: docs -->
Example usage that fetches challenges from the CTFd demo instance and attempts to submit a flag for a challenge:
```ts
import { CTFdClient } from '@b01lers/ctfd-api';

const client = new CTFdClient({
    url: 'https://demo.ctfd.io/',
    username: 'user',
    password: 'password',
});

// Fetch challenges list
const challs = await client.getChallenges();

// Fetch scoreboard data
const scoreboard = await client.getScoreboard();
console.log(scoreboard.slice(0, 5));

// Get details about a challenge, and submits a flag
const chall = challs.find((c) => c.name === 'The Lost Park')!;
const details = await client.getChallengeDetails(chall.id);
console.log(details.description);

await client.submitFlag(chall.id, 'cftd{test_flag}');
```
