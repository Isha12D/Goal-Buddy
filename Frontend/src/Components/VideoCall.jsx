import React, { useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const VideoCall = ({ socket, currentUser, remoteUser, onClose, isCaller }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const ICE_SERVERS = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peerConnection.current = new RTCPeerConnection(ICE_SERVERS);

        // Add local tracks
        stream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, stream);
        });

        // Remote track handler
        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // ICE candidate handler
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit('ice-candidate', {
              candidate: event.candidate,
              to: remoteUser.name,
            });
          }
        };

        // ✅ If this user is the caller, create and send offer
        if (isCaller) {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);

          socket.current.emit('video-offer', {
            offer,
            from: currentUser.name,
            to: remoteUser.name,
          });
        }

      } catch (err) {
        console.error("Error setting up video call:", err);
      }
    };

    setup();

    // Handle incoming offer (if callee)
    socket.current.on('video-offer', async ({ offer, from }) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peerConnection.current = new RTCPeerConnection(ICE_SERVERS);
        stream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, stream);
        });

        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit('ice-candidate', {
              candidate: event.candidate,
              to: from,
            });
          }
        };

        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.current.emit('video-answer', {
          answer,
          to: from,
        });

        setCallAccepted(true);
      } catch (error) {
        console.error('Error handling incoming offer:', error);
      }
    });

    // Handle video answer (for caller)
    socket.current.on('video-answer', async ({ answer }) => {
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallAccepted(true);
      } catch (err) {
        console.error('Error setting remote description for answer:', err);
      }
    });

    // Handle ICE candidate
    socket.current.on('ice-candidate', async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
      socket.current.off('video-offer');
      socket.current.off('video-answer');
      socket.current.off('ice-candidate');
      onClose();
    };

    if (isCaller) {
      setTimeout(() => {
        if (!callAccepted) {
          console.warn('⏳ No response yet... keeping UI open for debug');
          setCallAccepted(false); // keep overlay
        }
      }, 10000); // 10 seconds
    }

  }, []);

  return (
    <div className="fixed top-20 left-1/4 w-[600px] h-[400px] bg-black rounded-lg shadow-lg z-50 flex flex-col">
      <div className="flex justify-end p-2">
        <button onClick={onClose} className="text-white text-xl hover:text-red-500">
          <IoMdClose />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {!callAccepted ? (
          <div className="absolute inset-0 bg-black bg-opacity-80 text-white flex flex-col items-center justify-center z-50">
            <p className="text-2xl font-semibold animate-pulse">📞 Calling {remoteUser.name}...</p>
            <p className="text-sm mt-2">Waiting for them to accept the call</p>
          </div>
        ) : null}


        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded-lg border-2 border-blue-30"
        />
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-32 h-24 rounded-md border-2 border-white shadow-lg"
        />
      </div>
    </div>
  );
};

export default VideoCall;
