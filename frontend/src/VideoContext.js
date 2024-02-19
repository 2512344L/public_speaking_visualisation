import React, { createContext, useState, useCallback ,useEffect} from 'react';


const VideoContext = createContext({
  videoUUID: null,
  setVideoUUID: () => {},
});

export const VideoProvider = ({ children }) => {
  // 直接在 useState 中尝试从 sessionStorage 获取 videoUUID
  const [videoUUID, setVideoUUID] = useState(() => sessionStorage.getItem('videoUUID'));

  const updateVideoUUID = useCallback((newUUID) => {
    setVideoUUID(newUUID);
    // 当 videoUUID 更新时，同时保存到 sessionStorage
    sessionStorage.setItem('videoUUID', newUUID);
  }, []);

  // 监听 videoUUID 变化，第一次渲染不会执行，只有 videoUUID 更新后才执行
  useEffect(() => {
    if (videoUUID) {
      sessionStorage.setItem('videoUUID', videoUUID);
    }
  }, [videoUUID]);

  return (
    <VideoContext.Provider value={{ videoUUID, setVideoUUID: updateVideoUUID }}>
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContext;
// const VideoContext = createContext({
//   setVideoUUID: () => {},
// });
//
// export const VideoProvider = ({ children }) => {
//   const [videoUUID, setVideoUUID] = useState(null);
//
//   const updateVideoUUID = useCallback((newUUID) => {
//     setVideoUUID(newUUID);
//   }, []);
//
//   return (
//     <VideoContext.Provider value={{ videoUUID, setVideoUUID: updateVideoUUID }}>
//       {children}
//     </VideoContext.Provider>
//   );
// };
//
// export default VideoContext;
