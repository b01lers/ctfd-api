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

// Submit a flag for a challenge
const chall = challs.find((c) => c.name === 'The Lost Park')!;
await client.submitFlag(chall.id, 'cftd{test_flag}');
```
