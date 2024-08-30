import { Server } from "socket.io";
import { UnreadGet, UpdateNotifications } from "./usecases/index.js";
import dependencies from "./frameworks/dependencies.js";
const usersWithSocketId = new Map();
const theatreWithSocketId = new Map();
let io;

export const connectSocket = (http) => {
  try {
    io = new Server(http, {
      cors: {
        origin: ["http://localhost:4000", "http://localhost:3000"],
      },
    });
    console.log("SOCKET");
    io.on("connection", (socket) => {
      console.log("SOCKET CONNENCTED");

      //CONNECT_USER
      socket.on("connect-user", async (user_id) => {
        usersWithSocketId.set(user_id, socket?.id);
        console.log("USER_SOCKET_MAP", usersWithSocketId);

        //CHECKING_FOR_UNREAD_NOTIFICATIONS
        const getUnreadUseCase = new UnreadGet(dependencies);
        const notificationList = await getUnreadUseCase.execute(user_id);
        console.log(notificationList);

        //EMITTING_EVENT_IF_UNREAD_NOTIFICATIONS_EXIST
        if (notificationList?.length > 0) {
          socket.emit("has-unread-notifications", notificationList);
        }
      });

      //REMOVE_USER
      socket.on("remove-user", (user_id) => {
        if (usersWithSocketId.has(user_id)) {
          usersWithSocketId.delete(user_id);
        }
        console.log("USER_SOCKET_MAP", usersWithSocketId);
      });

      //CONNECT_THEATRE
      socket.on("connect-theatre", async (theatre_id) => {
        theatreWithSocketId.set(theatre_id, socket?.id);
        console.log("THEATRE_SOCKET_MAP", theatreWithSocketId);

        //CHECKING_FOR_UNREAD_NOTIFICATIONS
        const getUnreadUseCase = new UnreadGet(dependencies);
        const notificationList = await getUnreadUseCase.execute(theatre_id);
        console.log(notificationList);

        //EMITTING_EVENT_IF_UNREAD_NOTIFICATIONS_EXIST
        if (notificationList?.length > 0) {
          socket.emit("has-unread-notifications-for-theatre", notificationList);
        }
      }); 

      //REMOVE_THEATRE 
      socket.on("remove-theatre", (theatre_id) => {
        if (theatreWithSocketId.has(theatre_id)) {
          theatreWithSocketId.delete(theatre_id);
        }
        console.log("THEATRE_SOCKET_MAP", theatreWithSocketId);
      });


      //NOTIFICATION_STATUS_UPDATE_TO_READ
      socket.on('read-notifications',async (unreadIds)=>{
        if(unreadIds?.length > 0){
          const updateNotificationStatusUseCase = new UpdateNotifications(dependencies);
          for(let unread of unreadIds){
            await updateNotificationStatusUseCase.execute(unread)
          }
          console.log("UPDATED");
          socket.emit("has-unread-notifications", []);
        }
      })

       //NOTIFICATION_STATUS_UPDATE_TO_READ_THEATRE
       socket.on('read-notifications-theatre',async (unreadIds)=>{
        if(unreadIds?.length > 0){
          const updateNotificationStatusUseCase = new UpdateNotifications(dependencies);
          for(let unread of unreadIds){
            await updateNotificationStatusUseCase.execute(unread)
          }
          console.log("UPDATED");
          socket.emit("has-unread-notifications-for-theatre", []);
        }
      })

      socket.conn.on("close", (reason) => {
        console.log("SOCKET CLOSED");
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendUserNotification = (notification, reciever_id) => {
  console.log("SEND-NOTI",usersWithSocketId.get(reciever_id));
  io.to(usersWithSocketId.get(reciever_id)).emit('new-notifications',notification);
};

export const sendTheatreNotification = (notification, reciever_id) => {
  console.log("SEND-THEATRE-NOTI");
  io.to(theatreWithSocketId.get(reciever_id)).emit('new-notifications',notification);
};
