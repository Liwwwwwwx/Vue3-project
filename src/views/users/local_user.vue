<template>
  <div class="btn">
    <input
      type="text"
      v-model="roomId"
      placeholder="请输入房间号ID"
      maxlength="40"
    />
    <button class="joinBtn" type="button" @click="JoinRoom">加入</button>
    <button class="leaveBtn" type="button" @click="LeaveRoom">离开</button>
  </div>
  <div class="video">
    <video :srcObject="localStream" autoplay muted playsinline>本地窗口</video>
    <video :srcObject="remoteStream" autoplay playsinline>远端窗口</video>
  </div>
</template>

<script setup lang="ts">
import ws from "@/ws/index";
import { ref, reactive, onMounted, inject } from "vue";
import { JsonMsg } from "@/type/index";

const SIGNAL_TYPE_JOIN: string = "join";
const SIGNAL_TYPE_RESP_JOIN: string = "resp-join";
const SIGNAL_TYPE_LEAVE: string = "leave";
const SIGNAL_TYPE_NEW_PEER: string = "new-peer";
const SIGNAL_TYPE_PEER_LEAVE: string = "peer-leave";
const SIGNAL_TYPE_OFFER: string = "offer";
const SIGNAL_TYPE_ANSWER: string = "answer";
const SIGNAL_TYPE_CANDIDATE = "candidate";

let localUserId = ref<string>(Math.random().toString(36).substring(2));
let remoteUserId = ref<string>("-1");
let localStream: any = ref(null);
let remoteStream: any = ref(null);
let pc: any = null;
let roomId = ref<string>("");

const $Websocket: any = inject("$ws");
$Websocket.connect();
$Websocket.ws.onmessage = function (event: any) {
  var jsonMsg: any = null;

  try {
    jsonMsg = JSON.parse(event.data);
  } catch (e) {
    console.warn("onMessage parse JSON failed: " + e);
    return;
  }

  switch (jsonMsg.cmd) {
    case SIGNAL_TYPE_RESP_JOIN:
      handleResponseJoin(jsonMsg);
      break;
    case SIGNAL_TYPE_NEW_PEER:
      handleRemoteNewPeer(jsonMsg);
      break;
    case SIGNAL_TYPE_PEER_LEAVE:
      handleRemotePeerLeave(jsonMsg);
      break;
    case SIGNAL_TYPE_OFFER:
      handleRemoteOffer(jsonMsg);
      break;
    case SIGNAL_TYPE_ANSWER:
      handleRemoterAnswer(jsonMsg);
      break;
    case SIGNAL_TYPE_CANDIDATE:
      handleRemoteCandidate(jsonMsg);
      break;
  }
};

function handleResponseJoin(message: JsonMsg) {
  console.log("-----handleResponseJoin, remoteUid: " + +message.remoteUid);
  remoteUserId.value = message.remoteUid;
}

function handleRemoteNewPeer(message: JsonMsg) {
  console.log("-----handleRemoteNewPeer-----, remoteUid: " + message.remoteUid);
  remoteUserId.value = message.remoteUid;
  doOffer();
}

function doOffer() {
  if (pc == null) {
    createPeerConnection();
  }
  pc.createOffer()
    .then(createOfferAndSendMessage)
    .catch(handleCreateofferError);
}

function createPeerConnection() {
  var defaultConfiguration: object = {
    bundlePolicy: "max-bundle",
    rtcpMuxPolicy: "require",
    iceTransportPolicy: "all",
    iceServers: [
      {
        urls: [
          "turn:43.143.178.100:3478?transport=udp",
          "turn:43.143.178.100:3478?transport=tcp",
        ],
        username: "lwx",
        credential: "123456",
      },
      {
        urls: ["stun:43.143.178.100:3478"],
      },
    ],
  };

  pc = new RTCPeerConnection(defaultConfiguration);

  pc.onicecandidate = handleIceCandidate;
  pc.ontrack = handleRemoteStreamAdd;
  pc.onconnectionstatechange = handleConnectionStateChange;
  pc.oniceconnectionstatechange = handleIceConnectionStateChange;

  localStream.value
    .getTracks()
    .forEach((track: any) => pc.addTrack(track, localStream.value));
}

function handleIceCandidate(event: any) {
  console.log("-----handleIceCandidate-----");
  if (event.candidate) {
    var candidateJson = {
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
    };

    var jsonMsg: JsonMsg = {
      cmd: SIGNAL_TYPE_CANDIDATE,
      roomId: roomId.value,
      uid: localUserId.value,
      remoteUid: remoteUserId.value,
      msg: JSON.stringify(candidateJson),
    };

    var message = JSON.stringify(jsonMsg);
    $Websocket.send(message);

    console.log("-----handleIceCandidate message: " + message);
    console.log("-----send candidate message -----");
  }
}

function handleRemoteStreamAdd(event: any) {
  console.log("-----handleRemoteStreamAdd-----");
  console.log(event);

  remoteStream.value = event.streams[0];
}

function handleConnectionStateChange() {
  if (pc != null) {
    console.log("ConnectionState -> " + pc.connectionState);
  }
}

function handleIceConnectionStateChange() {
  if (pc != null) {
    console.log("IceConnectionState -> " + pc.connectionState);
  }
}

function createOfferAndSendMessage(session: any) {
  pc.setLocalDescription(session)
    .then(() => {
      var jsonMsg: JsonMsg = {
        cmd: "offer",
        roomId: roomId.value,
        uid: localUserId.value,
        remoteUid: remoteUserId.value,
        msg: JSON.stringify(session),
      };

      var message = JSON.stringify(jsonMsg);
      $Websocket.send(message);
      console.log("-----send offer message-----");
    })
    .catch((error: Error) => {
      console.log("offer setLocalDescription faild: " + error);
    });
}

function handleCreateofferError(error: Error) {
  console.log("handleCreateOfferError: " + error);
}

function handleRemoteOffer(message: JsonMsg) {
  console.log("-----handleRemoteOffer-----");
  if (pc == null) {
    createPeerConnection();
  }

  var desc = JSON.parse(message.msg);

  pc.setRemoteDescription(desc);
  doAnswer();
}

function doAnswer() {
  pc.createAnswer()
    .then(createAnswerAndSendMessage)
    .catch(handleCreateAnswerError);
}

function createAnswerAndSendMessage(session: any) {
  pc.setLocalDescription(session)
    .then(() => {
      var jsonMsg: JsonMsg = {
        cmd: "answer",
        roomId: roomId.value,
        uid: localUserId.value,
        remoteUid: remoteUserId.value,
        msg: JSON.stringify(session),
      };

      var message = JSON.stringify(jsonMsg);
      $Websocket.send(message);

      console.log("-----send answer message-----");
    })
    .catch((error: Error) => {
      console.log("answer setLocalDescription failed: " + error);
    });
}

function handleCreateAnswerError(error: Error) {
  console.log("handleCreateAnswerError: " + error);
}

function handleRemoterAnswer(message: JsonMsg) {
  console.log("handleRemoteAnswer");

  var desc = JSON.parse(message.msg);
  pc.setRemoteDescription(desc);
}

function handleRemoteCandidate(message: JsonMsg) {
  console.log("-----handleRemoteCandidate-----");
  var jsonMsg = JSON.parse(message.msg);
  var candidateMsg = {
    sdpMLineIndex: jsonMsg.label,
    sdpMid: jsonMsg.id,
    candidate: jsonMsg.candidate,
  };

  var candidate = new RTCIceCandidate(candidateMsg);
  pc.addIceCandidate(candidate).catch((e: any) => {
    console.log("-----addIceCandidate failed: " + e.name);
  });
}

function handleRemotePeerLeave(message: JsonMsg) {
  console.log("handleRemotePeerLeave, remoteUid: " + message.remoteUid);

  remoteStream.value = {};
  if (pc != null) {
    pc.close;
    pc = null;
  }
}

function JoinRoom() {
  if (roomId.value == "" || roomId.value == "请输入房间ID") {
    alert("请输入房间ID");
    return;
  }

  console.log("加入按钮被点击, roomId: " + roomId.value);

  initLocalStream();
}

function initLocalStream() {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then(openLocalStream)
    .catch((e: any) => {
      alert("getUserMedia() error: " + e.name);
    });
}

function openLocalStream(stream: any) {
  console.log("open local stream");
  doJoin(roomId.value);
  localStream.value = stream;
  console.log(localStream.value);
}

function doJoin(roomId: string) {
  var jsonMsg = {
    cmd: SIGNAL_TYPE_JOIN,
    roomId: roomId,
    uid: localUserId.value,
  };

  var message = JSON.stringify(jsonMsg);
  $Websocket.send(message);

  console.log("-----doJoin message----- " + message);
}

function LeaveRoom() {
  console.log("离开按钮被点击");
  doLeave();
}

function doLeave() {
  var jsonMsg: JsonMsg = {
    cmd: SIGNAL_TYPE_LEAVE,
    roomId: roomId.value,
    uid: localUserId.value,
    remoteUid: "",
    msg: "",
  };

  var message = JSON.stringify(jsonMsg);
  $Websocket.send(message);
  console.log("-----doLeave message: " + message);

  hangup();
}

function hangup() {
  localStream.value = {};
  remoteStream.value = {};

  closeLocalStream();

  if (pc != null) {
    pc.close();
    pc = null;
  }
}

function closeLocalStream() {
  if (localStream.value != null) {
    localStream.value.getTracks().forEach((track: any) => {
      track.stop();
    });
  }
}
</script>

<style scoped></style>
