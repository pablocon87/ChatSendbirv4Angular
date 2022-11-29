import { Injectable,Query} from '@angular/core';
import { ConnectableObservable, filter, Observable, of } from 'rxjs';
import SendbirdChat,{SendbirdChatParams,SendbirdError,BaseChannel, User, ConnectionHandler, ChannelType, MetaData,UserUpdateParams} from '@sendbird/chat'
import { GroupChannelHandler,GroupChannelListOrder,GroupChannelCountParams,GroupChannelModule,GroupChannel,GroupChannelCreateParams,GroupChannelListQueryParams,GroupChannelListQuery, MyMemberStateFilter } from '@sendbird/chat/groupChannel';
import { OpenChannelModule, SendbirdOpenChat,OpenChannel} from '@sendbird/chat/openChannel';
import {PushNotificationDeliveryOption,BaseMessage,PreviousMessageListQueryParams,PreviousMessageListQuery, MessageTypeFilter, ReplyType, MessageRequestHandler, MessageModule, UserMessageCreateParams,} from '@sendbird/chat/message';
import { GroupChannelHandlerParams } from '@sendbird/chat/lib/__definition';
import {RouterModule, Routes,Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {

  
  // https://dashboard.sendbird.com
   APP_ID = '3287143B-4F04-46D6-9A71-C2A36E0FAF02';
   token='12fcfdfe87746e0efb9427d2940a949ac3cd485e';
  sb=  SendbirdChat.init(
    {
    appId: this.APP_ID,
    
    modules: [
        new OpenChannelModule(),
        new GroupChannelModule(),
        new MessageModule(),
      
        
    ],
    
});
  constructor(public grouprc:GroupChannelModule,public router:Router) { 
   
  }
  init() {
    this.sb;
  }
connect(userId: string, token: any,nick:string):Promise<User>{
  //console.log("USERID"+userId);
  localStorage.setItem('nick',nick);
  localStorage.setItem('userId',userId);
  
  return this.sb.connect(userId, token)
  
 
}
 
  isConnected() {
    return this.sb && this.sb.currentUser && this.sb.currentUser.userId;
  }
 Disconnect():Promise<void> {
  return this.sb.disconnect();
 }
  getConnectedUser() {
    return this.sb && this.sb.currentUser ? this.sb.currentUser : null;
  }
  registerEventHandlers(UNIQUE_HANDLER_ID: string,callback:any) {
   
    
    
    const groupChannelHandler: GroupChannelHandler = new GroupChannelHandler({
      onMessageReceived: (channel: BaseChannel, message: BaseMessage)=> { 
      
         callback({
          event: 'onMessageReceived',
          data: {
            channel,
            message,
          },
        })
      
        
      },
      onMessageUpdated: (channel: BaseChannel, message: BaseMessage) => {
        callback({
          event: 'onMessageUpdated',
          data: {
            channel,
            message,
          },
        })

      },
      onMessageDeleted: (channel: BaseChannel, messageId: number) => {},
      onChannelChanged: (channel: BaseChannel) => {},
      onChannelDeleted: (channelUrl: string, channelType: ChannelType) => {},
      onChannelFrozen: (channel: BaseChannel) => {},
      onChannelUnfrozen: (channel: BaseChannel) => {},
      onMetaDataCreated: (channel: BaseChannel, metaData: MetaData) => {},
      //onMetaCounterUpdated: (channel: BaseChannel, metaData: MetaData) => {},
     // onMetaCountersDeleted: (channel: BaseChannel, metaDataKeys: string[]) => {},
      onChannelHidden: (channel: BaseChannel) => {},
      onUserReceivedInvitation: (channel: GroupChannel, inviter: User, invitees: User[]) => {console.log('recivi invitacion')},
      onUserDeclinedInvitation: (channel: GroupChannel, inviter: User, invitee: User) => {},
      onUserJoined: (channel: GroupChannel, user: User) => {
        callback({
          event: 'onUserJoined',
          data: {
            channel,
            user,
          },
        })
      },
      onUserLeft: (channel: GroupChannel, user: User) => {},
      onUndeliveredMemberStatusUpdated: (channel: GroupChannel) => {
      // channel.markAsDelivered().then((ok)=>{})
     // console.log("DENTRO LASTMESSAGE"+JSON.stringify(channel.lastMessage['message']));
        callback({
          event: 'onUndeliveredMemberStatusUpdated',
          
          data: {
            channel,
          },
        })

      },
      onUnreadMemberStatusUpdated: (channel: GroupChannel) => { 
        //console.log("DENTRO MEMBERS LASTMESSAGE"+JSON.stringify(channel.lastMessage['message']));
        callback({
          event: 'onUnreadMemberStatusUpdated',
          
          data: {
            channel,
          },
        })
      },
      onTypingStatusUpdated: (channel: GroupChannel) => {},
      onUserMuted: (channel: BaseChannel, user: User) => {},
      onUserUnmuted: (channel: BaseChannel, user: User) => {},
      onUserBanned: (channel: BaseChannel, user: User) => {},
      onUserUnbanned: (channel: BaseChannel, user: User) => {},
      onChannelMemberCountChanged: () => {},
      onOperatorUpdated(channel, users) {   },
      onMentionReceived(channel, message) {   },
    
    // Add this channel event handler to the `SendBird` instance.
    });
   this.sb.groupChannel.addGroupChannelHandler(UNIQUE_HANDLER_ID, groupChannelHandler);

  
  }
  async Deleting(channel:GroupChannel): Promise<any>{
    
   let chanel= await this.sb.groupChannel.getChannel(channel.url);
   
   return chanel.delete();
   
  }
 upDateProfile(url:string):Promise<User>{
  const par:UserUpdateParams={
    profileUrl:url,
    
  }
 return this.sb.updateCurrentUserInfo(par);

 }
 
  createGroupChannel( channelName: string,userIds: Array<string>,nick:string):Promise<GroupChannel>{
      const params:GroupChannelCreateParams={
        name: channelName,
        operatorUserIds:userIds,
        invitedUserIds:['Pepe Onguito'],
        isPublic:true,
        isDiscoverable:true,
        
        
        
      };
      
      
     return this.sb.groupChannel.createChannel(params);
       
  }
  Invitar( channelName: GroupChannel,userIds: string):Promise<GroupChannel>{

    let paramst:GroupChannelCreateParams={
     
      invitedUserIds:[userIds],
    }
return channelName.updateChannel(paramst);

  }
 
   getMyGroupChannels(): Promise<GroupChannel[]>{
    
    const listQuery=  this.sb.groupChannel.createMyGroupChannelListQuery({
      limit:15,
      includeEmpty:true,
      myMemberStateFilter:MyMemberStateFilter.JOINED,
      order:GroupChannelListOrder.LATEST_LAST_MESSAGE,
      
    });
    
  
    let query =  this.sb.groupChannel.createMyGroupChannelListQuery(listQuery);
    
    let es:any;
    if (query.hasNext) {
  
     return query.next()
     
      
    }
 return es;
  }

  getMessagesFromChannel(groupChannel: GroupChannel):Promise<BaseMessage[]> {
    
    const listQuery: PreviousMessageListQueryParams={
      limit: 10,
      reverse: false,
      messageTypeFilter: MessageTypeFilter.ALL,
      replyType: ReplyType.NONE,
      includeThreadInfo: true,
      includeParentMessageInfo: false,
      includeMetaArray:true,
      
      includeReactions:true,

    };
    // Retrieving previous messages.
    const query: PreviousMessageListQuery= groupChannel.createPreviousMessageListQuery(listQuery);
    return query.load();

  }
  sendMessage(channel: GroupChannel | OpenChannel,message: string,):MessageRequestHandler {
    
    let pmen:UserMessageCreateParams={
      mentionedUserIds:[localStorage.getItem('userId')!],
    pushNotificationDeliveryOption:PushNotificationDeliveryOption.DEFAULT,
      message:message
    };
    
    return channel.sendUserMessage(pmen);
  }


}


