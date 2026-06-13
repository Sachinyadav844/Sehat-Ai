import * as React from 'react';
import { socketService } from '../services/socket/client';

export type VideoFrame = {
  sessionId: string;
  consultationId: string;
  index?: number;
  frame?: string; // base64 string for now
  type?: 'frame' | 'end';
};

export function useVideoSocket(initialConsultationId?: string) {
  const [consultationId, setConsultationId] = React.useState<string | undefined>(initialConsultationId);
  const [connected, setConnected] = React.useState(false);
  const [frames, setFrames] = React.useState<VideoFrame[]>([]);
  const [sessionId, setSessionId] = React.useState<string | undefined>(undefined);
  const [streamUrl, setStreamUrl] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    if (!consultationId) return;

    const socket = socketService.connect(consultationId);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onFrame = (data: VideoFrame) => {
      setFrames((prev) => {
        const next = [...prev, data];
        return next.slice(-200);
      });
    };

    const onStarted = (data: any) => {
      if (data?.sessionId) setSessionId(data.sessionId);
      if (data?.streamUrl) setStreamUrl(data.streamUrl);
    };

    const onVideoStream = (data: { sessionId: string; streamUrl: string }) => {
      if (data?.sessionId) setSessionId(data.sessionId);
      if (data?.streamUrl) setStreamUrl(data.streamUrl);
    };

    const onStopped = (data: any) => {
      if (data?.sessionId && data.sessionId === sessionId) {
        setSessionId(undefined);
        setStreamUrl(undefined);
      }
    };

    const onError = (err: any) => setError(err);

    socket?.on('connect', onConnect);
    socket?.on('disconnect', onDisconnect);
    socket?.on('video:frame', onFrame);
    socket?.on('video:started', onStarted);
    socket?.on('video_stream', onVideoStream);
    socket?.on('video:stopped', onStopped);
    socket?.on('video:error', onError);

    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('video:frame', onFrame);
      socket?.off('video:started', onStarted);
      socket?.off('video_stream', onVideoStream);
      socket?.off('video:stopped', onStopped);
      socket?.off('video:error', onError);
      socketService.disconnect();
      setConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultationId, sessionId]);

  const connect = React.useCallback((id: string) => {
    setConsultationId(id);
  }, []);

  const disconnect = React.useCallback(() => {
    setConsultationId(undefined);
    socketService.disconnect();
    setConnected(false);
    setSessionId(undefined);
    setStreamUrl(undefined);
    setFrames([]);
  }, []);

  const startVideoCall = React.useCallback((opts: { consultationId?: string; avatarId?: string; language?: string; quality?: string } = {}) => {
    const id = opts.consultationId || consultationId;
    if (!id) throw new Error('consultationId is required to start video');
    socketService.connect(id);
    socketService.getSocket()?.emit('start_video', {
      consultationId: id,
      avatarId: opts.avatarId,
      language: opts.language,
      quality: opts.quality,
    });
  }, [consultationId]);

  const stopVideo = React.useCallback(() => {
    socketService.getSocket()?.emit('stop_video');
  }, []);

  const clearFrames = React.useCallback(() => setFrames([]), []);

  return {
    connect,
    disconnect,
    connected,
    frames,
    latestFrame: frames[frames.length - 1],
    sessionId,
    streamUrl,
    error,
    startVideoCall,
    stopVideo,
    clearFrames,
  } as const;
}

export default useVideoSocket;
