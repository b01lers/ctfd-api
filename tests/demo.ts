import { CTFdClient } from '../src/client';


;(async () => {
    const client = new CTFdClient({
        url: 'https://demo.ctfd.io/',
        username: 'user',
        password: 'password',
    });

    const challs = await client.getChallenges();
    console.log(challs.data);

    const chall = challs.data.find((c) => c.name === 'The Lost Park')!;
    const res = await client.submitFlag(chall.id, 'cftd{test_flag}');
    console.log(res);
})()
