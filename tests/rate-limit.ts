import { CTFdClient } from '../src/client';


;(async () => {
    const client = new CTFdClient({
        url: 'https://demo.ctfd.io/',
        username: 'user',
        password: 'password',
    });

    const chall = (await client.challenges.getChallenges()).find((c) => c.name === 'The Lost Park')!;

    const res = await client.challenges.submitFlag(chall.id, 'test');
    console.log(res);

    for (let i = 0; i < 20; i++) {
        console.log(await client.challenges.submitFlag(chall.id, 'test'));
    }
})()
