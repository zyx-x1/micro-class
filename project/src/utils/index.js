export const formatTime = (timeObj) => {
  timeObj = new Date(timeObj);
  if (timeObj instanceof Date) {
    let y = timeObj.getFullYear();
    let m = timeObj.getMonth() + 1;
    let d = timeObj.getDate();
    let hh = timeObj.getHours().toString().padStart(2, "0");
    let mm = timeObj.getMinutes().toString().padStart(2, "0");
    let ss = timeObj.getSeconds().toString().padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  } else {
    return {
      msg: "参数不是日期对象",
    };
  }
};
export const getVideoCover = (url) => {
  return new Promise(function (resolve) {
    let dataURL = '';
    let video = document.createElement("video");
    video.setAttribute('crossOrigin', 'anonymous');//处理跨域
    video.setAttribute('src', url);
    video.setAttribute('width', 400);
    video.setAttribute('height', 240);
    video.setAttribute('muted', "muted");
    video.setAttribute('autoplay', 'autoplay');
    video.addEventListener('canplaythrough', function () {
      let canvas = document.createElement("canvas"),
        width = video.width, //canvas的尺寸和图片一样
        height = video.height;
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(video, 0, 0, width, height); //绘制canvas
      dataURL = canvas.toDataURL('image/jpeg'); //转换为base64
      resolve(dataURL);
    });
  })
}
