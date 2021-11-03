import React, { useMemo, useCallback, useEffect } from "react";
import { Config, joinRoom } from "trystero";

const appId = "SchnickSchnackSchnuck";
const config: Config = { appId };

const roomName = "yoyodyneX123";

export const useConnection = (
  receiveData: (isMaster: boolean, data: any) => void
) => {
  const [room, setRoom] = React.useState<any | undefined>(undefined);
  const [peerCount, setPeerCount] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [peerReady, setPeerReady] = React.useState(false);
  const [sendReady, setSendReady] = React.useState<any>(undefined);
  const [sendData, setSendData] = React.useState<any>(() => () => {});
  const [listenData, setListenData] = React.useState<any>(() => () => {});
  const [isMaster, setIsMaster] = React.useState(true);

  useEffect(() => {
    listenData((data: any) => receiveData(isMaster, data));
  }, [receiveData, isMaster, listenData]);

  const onJoinClick = useCallback(() => {
    const room = joinRoom(config, roomName);
    room.onPeerJoin((id) => {
      console.log(`${id} joined, peers: ${room?.getPeers().length}`);
      setPeerCount(room?.getPeers().length ?? 0);
    });
    room.onPeerLeave((id) => {
      console.log(`${id} left`);
      setPeerCount(room?.getPeers().length ?? 0);
      setIsMaster(true);
      setReady(false);
      setPeerReady(false);
    }, []);

    const [sendReady, listenPeerReady] = room.makeAction("ready");
    setSendReady(() => sendReady);
    listenPeerReady((_: any, id: number) => {
      console.log("got start game");
      setPeerReady(true);
    });

    const [sendData, listenData] = room.makeAction("data");
    setSendData(() => sendData);
    setListenData(() => listenData);

    setRoom(room);
    setIsMaster(false);
    console.log(`peers: ${room?.getPeers().length}`);
  }, [setListenData]);

  const onLeaveClick = useCallback(() => {
    room.leave();
    setRoom(undefined);
    setIsMaster(true);
    setReady(false);
    setPeerReady(false);
    setSendData(() => () => {});
  }, [room]);

  const onReady = useCallback(() => {
    setIsMaster(!peerReady);
    sendReady({});
    setReady(true);
  }, [peerReady, sendReady]);

  const buttonProps = useMemo(() => {
    const getButtonProps = () => {
      if (room) {
        if (peerCount === 0) {
          return { onClick: onLeaveClick, label: "WAITING... (CANCEL)" };
        }
        if (!ready) {
          return { onClick: onReady, label: "READY" };
        }
        return { onClick: onLeaveClick, label: "LEAVE" };
      }
      return { onClick: onJoinClick, label: "JOIN" };
    };
    return getButtonProps();
  }, [onJoinClick, onLeaveClick, onReady, peerCount, ready, room]);

  if (!sendData) {
    throw new Error("huhuh");
  }

  return {
    ready,
    peerReady,
    isMaster,
    sendData,
    buttonProps
  };
};
