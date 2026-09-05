export {};
// 1. Create a Promise that returns the string "Hello Async" after 2 seconds.
const promise1 = new Promise<string>((resolve) => {
    setTimeout(() => resolve("Hello Async"), 2000);
  });
  await promise1.then(res => console.log(`[Bài 1] ${res}`));

// 2. Write a function that returns a Promise resolving with the number 10 after 1 second.
const returnTen = (): Promise<number> => {
    return new Promise((resolve) => setTimeout(() => resolve(10), 1000));
  };
  await returnTen().then(res => console.log(`[Bài 2] Result: ${res}`));

// 3. Write a function that rejects a Promise with the error "Something went wrong" after 1 second.
const rejectPromise = (): Promise<never> => {
    return new Promise((_, reject) => setTimeout(() => reject("Something went wrong"), 1000));
  };
  await rejectPromise().catch(err => console.log(`[Bài 3] Error caught: ${err}`));

// 4. Use .then() and .catch() to handle a Promise that returns a random number.
const randomPromise = new Promise<number>((resolve, reject) => {
    const num = Math.random();
    num > 0.5 ? resolve(num) : reject(new Error("Number too small"));
  });
  await randomPromise
    .then(n => console.log(`[Bài 4] Success: ${n}`))
    .catch(e => console.log(`[Bài 4] Failed: ${e.message}`));

// 5. Create a function simulateTask(time) that returns a Promise resolving with "Task done" after time ms.
const simulateTask = (time: number): Promise<string> => {
    return new Promise((resolve) => setTimeout(() => resolve(`Task done in ${time}ms`), time));
  };
  await simulateTask(500).then(res => console.log(`[Bài 5] ${res}`));

// 6. Use Promise.all() to run 3 simulated Promises in parallel and print the result.
const allRes = await Promise.all([simulateTask(100), simulateTask(200), simulateTask(300)]);
console.log(`[Bài 6] Promise.all result:`, allRes);

// 7. Use Promise.race() to return whichever Promise resolves first.
const raceRes = await Promise.race([simulateTask(100), simulateTask(200), simulateTask(300)]);
console.log(`[Bài 7] Promise.race result:`, raceRes);

// 8. Create a Promise chain: square the number 2, then double it, then add 5.
await Promise.resolve(2)
  .then(n => n * n) // 4
  .then(n => n * 2) // 8
  .then(n => n + 5) // 13
  .then(res => console.log(`[Bài 8] Chain result: ${res}`));

// 9. Write a Promise that reads an array after 1 second and filters even numbers.
const arrayPromise = new Promise<number[]>((resolve) => setTimeout(() => resolve([1, 2, 3, 4, 5, 6]), 1000));
await arrayPromise
  .then(arr => arr.filter(n => n % 2 === 0))
  .then(res => console.log(`[Bài 9] Filtered array:`, res));

// 10. Use .finally() to log "Done" when a Promise finishes (success or failure).
await Promise.resolve("Task 10")
  .then(res => console.log(`[Bài 10] Running ${res}`))
  .finally(() => console.log("[Bài 10] Done"));

// 11. Convert Exercise 1 into async/await.
const asyncEx11 = async () => {
    const p = new Promise<string>(resolve => setTimeout(() => resolve("Hello Async"), 2000));
    const msg = await p;
    console.log(`[Bài 11] ${msg}`);
  };
  await asyncEx11();

// 12. Write an async function that calls simulateTask(2000) and logs the result.
const asyncEx12 = async () => {
    const res = await simulateTask(2000);
    console.log(`[Bài 12] ${res}`);
  };
  await asyncEx12();

// 13. Handle errors using try/catch with async/await.
const asyncEx13 = async () => {
    try {
      await rejectPromise();
    } catch (error) {
      console.log(`[Bài 13] Caught error: ${error}`);
    }
  };
  await asyncEx13();

// 14. Write an async function that takes a number, waits 1 second, and returns the number × 3.
const multiplyBy3 = async (n: number): Promise<number> => {
    await new Promise(res => setTimeout(res, 1000));
    return n * 3;
  };
  const res14 = await multiplyBy3(5);
  console.log(`[Bài 14] 5 x 3 = ${res14}`);

// 15. Call multiple async functions sequentially using await.
const asyncEx15 = async () => {
    const res1 = await multiplyBy3(10);
    const res2 = await multiplyBy3(20);
    console.log(`[Bài 15] Sequential results: ${res1}, ${res2}`);
  };
  await asyncEx15();

// 16. Call multiple async functions in parallel using Promise.all().
const asyncEx16 = async () => {
    const res = await Promise.all([multiplyBy3(10), multiplyBy3(20)]);
    console.log(`[Bài 16] Parallel results:`, res);
  };
  await asyncEx16();

// 17. Use for await...of to iterate over an array of Promises.
const asyncEx17 = async () => {
    const promises = [Promise.resolve("A"), Promise.resolve("B")];
    console.log(`[Bài 17] for await...of results:`);
    for await (const val of promises) {
      console.log(`- ${val}`);
    }
  };
  await asyncEx17();

// 18. Write an async function fetchUser(id) that simulates an API call (resolves a user object after 1 second).
const fetchUser = async (id: number) => {
    await new Promise(res => setTimeout(res, 1000));
    return { id, name: `User_${id}` };
  };
  const user18 = await fetchUser(1);
  console.log(`[Bài 18] fetchUser:`, user18);

// 19. Create an async function fetchUsers(ids: number[]) that calls fetchUser for each ID.
const fetchUsers = async (ids: number[]) => {
    return await Promise.all(ids.map(id => fetchUser(id)));
  };
  const users19 = await fetchUsers([1, 2, 3]);
  console.log(`[Bài 19] fetchUsers:`, users19);

// 20. Add a timeout: if the API call takes more than 2 seconds, throw an error.
const asyncEx20 = async () => {
    const slowAPI = new Promise(res => setTimeout(() => res("Success"), 3000));
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout after 2s")), 2000));
    
    try {
      await Promise.race([slowAPI, timeout]);
    } catch (error: any) {
      console.log(`[Bài 20] Expected Error: ${error.message}`);
    }
  };
  await asyncEx20();

// 21. Use fetch to get data from a public API (e.g., https://jsonplaceholder.typicode.com/todos/1).
const asyncEx21 = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await res.json();
    console.log(`[Bài 21] Fetched data:`, data);
  };
  await asyncEx21();

// 22. Call the API multiple times and log the results.
const asyncEx22 = async () => {
    const data = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/todos/1").then(r => r.json()),
      fetch("https://jsonplaceholder.typicode.com/todos/2").then(r => r.json())
    ]);
    console.log(`[Bài 22] Multiple titles:`, data.map(d => d.title));
  };
  await asyncEx22();

// 23. Write an async function that fetches a list of todos and filters out those that are not completed.
const asyncEx23 = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data: { id: number; completed: boolean; title: string }[] = await res.json();
    const notCompleted = data.filter(todo => !todo.completed).slice(0, 2);
    console.log(`[Bài 23] Not completed (first 2):`, notCompleted);
  };
  await asyncEx23();

// 24. Write an async function postData() that sends a POST request to a test API.
const asyncEx24 = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({ title: "My Post", body: "Hello", userId: 1 }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    const data = await res.json();
    console.log(`[Bài 24] POST Result:`, data);
  };
  await asyncEx24();

// 25. Create a function downloadFile that simulates downloading a file in 3 seconds and logs when done.
const downloadFile = async () => {
    await new Promise(res => setTimeout(res, 3000));
    console.log("[Bài 25] File downloaded successfully.");
  };
  await downloadFile();

// 26. Use async/await with setTimeout to simulate a 5-second wait.
const asyncEx26 = async () => {
    console.log("[Bài 26] Waiting 5 seconds...");
    await new Promise(res => setTimeout(res, 5000));
    console.log("[Bài 26] 5 seconds passed!");
  };
  await asyncEx26();

// 27. Write a function fetchWithRetry(url, retries) that retries up to retries times if the API call fails.
const fetchWithRetry = async (url: string, retries: number): Promise<any> => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Fetch failed");
      return await res.json();
    } catch (error) {
      if (retries > 0) {
        console.log(`[Bài 27] Retrying... (${retries} left)`);
        return await fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  };
  await fetchWithRetry("https://invalid-api-test-url.com", 2).catch(() => console.log(`[Bài 27] Failed after retries.`));

// 28. Write an async function batchProcess() that processes 5 async tasks at once (use Promise.all).
const batchProcess = async () => {
    const task = (id: number) => new Promise(res => setTimeout(() => res(`Task ${id} done`), 500));
    const res = await Promise.all([task(1), task(2), task(3), task(4), task(5)]);
    console.log(`[Bài 28] Batch Process:`, res);
  };
  await batchProcess();

// 29. Write an async function queueProcess() that processes tasks sequentially in a queue.
const queueProcess = async (tasks: (() => Promise<string>)[]) => {
    console.log("[Bài 29] Queue started:");
    for (const task of tasks) {
      console.log(await task());
    }
  };
  await queueProcess([
    () => new Promise(r => setTimeout(() => r("Task 1 done"), 500)), 
    () => new Promise(r => setTimeout(() => r("Task 2 done"), 500))
  ]);

// 30. Use async/await + Promise.allSettled() to handle multiple API calls and display their success/failure status.
const asyncEx30 = async () => {
    const results = await Promise.allSettled([
      fetch("https://jsonplaceholder.typicode.com/todos/1"),
      fetch("https://invalid-url-test.com")
    ]);
    console.log("[Bài 30] allSettled statuses:");
    results.forEach((res, i) => console.log(`- API ${i + 1}: ${res.status}`));
  };
  await asyncEx30();