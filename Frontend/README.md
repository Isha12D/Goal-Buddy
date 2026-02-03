# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Techs
#  npm install chart.js react-chartjs-2

# problems i faced :<>
# 1.goal id nikalna or phir usko update krna😑 --> const goals = await Goal.find(filter).select('_id'); 
# 2.personal or friends goal ko sath me rakhu y nhi
# 3.socket.io implementation a lot
# 4.npm install framer-motion(in profile.jsx)
# 5.a small section showing the rewards collected don't know how.
# 6. Time Spent on Goals but for this we need to store timestamp in database
# 7. combined the goals component for both shared, personal goals.
# 8. different goals id ho rhi thi isiliye checkbox check nhi ho paa rha tha. senderID = receiverId & receiverID = senderId :<

# 9. npm install react-calendar-heatmap

# 10. so agr ek user goal complete kr chuka hai and he's the winner to dusra usko update nhi kr skta, right? kyuki winner to ek hi hota h...so there was a problem i faced in my mark complete api like it was overwriting the winner. so the solution is that i was using findByIdAndUpdate, so it just updated but the correct method was --> 'findOneAndUpdate' which first filters the goal with required conditions and then only updates. so filtering was the game changer!!

# 11. How/ Where to store the JWT refresh token.

# 12. In update profile thing ---> Since you need to hash password if it changes, findById + save() is safer and preferred here. (rather than findOneAndUpdate)

# 13. Profile pic not visible becoz not able to fetch as it was added later. login (frontend + backend me res.json me add krna pda)

# 14. Mongo Error ❌ Error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.hidnoel.mongodb.net
    at QueryReqWrap.onresolve [as oncomplete] (node:internal/dns/promises:294:17) {
  errno: undefined,
  code: 'ECONNREFUSED',
  syscall: 'querySrv',
  hostname: '_mongodb._tcp.cluster0.hidnoel.mongodb.net'
    }

# ###########   FUTURE SCOPE   ##############
# 1. To add badges like 'achiever', 'consistent queen' etc.




