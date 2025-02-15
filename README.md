Using svelte 5 app to learn some svelte and azure swa

Original app created with vite starter app plus adapting it following 

https://www.youtube.com/watch?v=uSWMvDPpG0k

Uploaded to azure static web apps using vs code extension

Next steps:

api:

add an api
add default list to api
expect to see this on app startup
save list to api on change (won't do much except succeed/fail, no db yet)

Change of tack - try direct connection to cosmos db from static web app code to get started in a less complex fashion

create cosmos in azure
connect to it in the static web app src in an idiomatic swa way
put an api around a model which accesses this db connection
i.e. architect the static web app in an view<->api<->db modular fashion so we can rearrange later if required