import { CTFdClient } from '../src/client';


;(async () => {
    const client = new CTFdClient({
        url: 'https://demo.ctfd.io/',
        username: 'user',
        password: 'password',
    });

    const chall = (await client.getChallenges()).find((c) => c.name === 'Too Many Puppers')!;

    const res = await client.submitFlag(chall.id, 'test');
    console.log(res);

    for (let i = 0; i < 20; i++) {
        console.log(await client.submitFlag(chall.id, 'test'));
    }
})()
