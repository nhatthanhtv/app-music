const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const heading = $('header h2');
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const  playlist  = $('.playlist')



const app = {

  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,


 
  songs: [
    {
      name: "Yêu nhiều ghen nhiều",
      singer: "Thanh Hưng",
      path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui996/YeuNhieuGhenNhieuFreakDRemix-ThanhHungIdol-6226086.mp3?st=jXgpdNs31ljoQpgEfbTsgw&e=1628068529&download=true",
      image:
        "https://i.pinimg.com/originals/f8/6f/33/f86f3378e656883b33594f06d78d1634.jpg",
    },
    {
      name: "Nói với em",
      singer: "T Team",
      path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui999/MuonNoiVoiEm-TTeam-6288870.mp3?st=p2KaAUnRtOXNZZapIMAifg&e=1628068309&download=true",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2020/06/03/2/4/d/8/1591182534126_500.jpg",
    },
    {
      name: "Hạ còn vương nắng",
      singer: "DATKAA",
      path: "https://data.chiasenhac.com/down2/2164/2/2163098-c46e1827/32/Ha%20Con%20Vuong%20Nang%20-%20DatKaa.m4a",
      image:
        "https://data.chiasenhac.com/data/cover/139/138273.jpg",
    },
    {
      name: "Muộn rồi mà sao còn",
      singer: "Sơn Tùng M-TP",
      path: "https://aredir.nixcdn.com/Believe_Audio19/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3?st=w9AA-eyRI7yD_VYGfvVWeQ&e=1623141624",
      image: "https://pbs.twimg.com/media/Ez5jRyVVgAQN6Kh.jpg",
    },
    {
      name: "Răng khôn",
      singer: "Phương Anh",
      path: "https://data.chiasenhac.com/down2/2167/2/2166192-137081aa/128/Rang%20Khon%20-%20Phi%20Phuong%20Anh_%20RIN9.mp3",
      image:
        "https://data.chiasenhac.com/data/cover/140/139105.jpg",
    },

    {
      name: "Bỏ em vào balo",
      singer: "Tân Trần",
      path: "https://data25.chiasenhac.com/download2/2176/2/2175613-22b82a49/128/Bo%20Em%20vao%20Balo%20-%20Tan%20Tran_%20Freak%20D.mp3",
      image: "https://data.chiasenhac.com/data/cover/142/141557.jpg",
    },
    {
      name: "Đường quyền tình yêu",
      singer: "Avicii",
      path: "https://data3.chiasenhac.com/downloads/2094/2/2093504-6424030b/128/Duong%20Quyen%20Tinh%20Yeu%20-%20DatKaa_%20QT%20Beatz.mp3",
      image: "https://i.ytimg.com/vi/Hmbm3G-Q444/maxresdefault.jpg",
    },
  ],



  render: function () {
    const htmls = this.songs.map(function (song, index) {
      return `
            <div  class="song ${index === app.currentIndex ? 'active' : '' }" data-index=${index}>
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    
  },

  defineProperties: function(){
      Object.defineProperty(this,'currentSong', {
        get: function(){
            return this.songs[this.currentIndex];
        }
      })
  },

  handleEvents: function(){
    const _this = this;
    const cd = $('.cd')

    // xử lí CD xoay và dừng
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ],{
      duration: 10000,
      iterations: Infinity
    })
   
    cdThumbAnimate.pause()


    // xử lí phóng to thu nhỏ CD
    cdWidth = cd.offsetWidth

    document.onscroll = function(){
        const scrollTop =  document.documentElement.scrollTop || window.scrollY;
        const cdWidthNew = cdWidth - scrollTop;
      
        cd.style.width = cdWidthNew > 0 ?cdWidthNew + 'px' : 0
        cd.style.opacity = cdWidthNew / cdWidth;

    }
    // xử lí khi click play
    playBtn.onclick = function(){
      if(_this.isPlaying){
        audio.pause()
      }else{
        audio.play()
      }
    }
    // khi nhạc được chạy 
    audio.onplay = function(){
      _this.isPlaying = true;
      player.classList.add('playing')
      cdThumbAnimate.play()
    }
    // khi nhạc dừng 
    audio.onpause = function(){
      _this.isPlaying = false;
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }
    // khi tiến độ bài hát thay dổi
    audio.ontimeupdate =  function(){
      if(audio.duration) {
        const progressPercrent = Math.floor(audio.currentTime / audio.duration *100)
        progress.value = progressPercrent;
      }
    }
    // xử lí tua song
    progress.onchange = function(e){
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }
    //next bài hát
    nextBtn.onclick = function(){
      if(_this.isRandom){
          _this.playRandomSong()
      }else{
        
        _this.nextSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()

    }
    // lùi bài hát
    prevBtn.onclick = function(){
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        
        _this.prevSong()
      }
      audio.play()
      scrollToActiveSong
    }

    //  xử lí random bật /tắt song
    randomBtn.onclick = function(e){
      _this.isRandom  = !_this.isRandom
      randomBtn.classList.toggle('active',_this.isRandom)
      
    }
    // sử lí lập lại bài hát
    repeatBtn.onclick = function(){
      _this.isRepeat =!_this.isRepeat
      repeatBtn.classList.toggle('active',_this.isRepeat)
    }
    // sử lí next sông khi end
    audio.onended = function(){
      if(_this.isRepeat){
        audio.play()
      }else{
        nextBtn.click()
      }
    }
    
    // lắng nghe click vào play list
    playlist.onclick = function(e){
      const songNode = e.target.close('.song:not(.active)')
      if( songNode || !e.target.closest('.option')){
        // xử lí khi click vào song
        
        if(songNode){
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurentSong()
          _this.render()
          audio.play() 
        }
        // xử lí click vào option
        if(!e.target.closest('.option')){

        }
      }
    }
  },

  scrollToActiveSong: function(){
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block:'center'
  
      })
    }, 300);
  },


  loadCurentSong:function(){

    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },

// next bài hát
  nextSong: function(){
    this.currentIndex ++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0
    }
    this.loadCurentSong()
    
  },
  // lùi bài hát
  prevSong: function(){
    this.currentIndex --
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurentSong()
    
  },
  playRandomSong: function(){
    let newIndex 
    do{
      newIndex = Math.floor(Math.random()* this.songs.length)
    }while(newIndex === this.currentIndex)

    this.currentIndex = newIndex
    this.loadCurentSong()
  },
  start: function () {
    // định nghĩa các thuộc tính cho OJect
    this.defineProperties()
    // lắng nghe sự kiện Dom
    this.handleEvents();
    
    // tải thông tin bài hát dầu tiên vào UI khi chạy lần đầu
    this.loadCurentSong()
    // render bài hát ra platlist
    this.render();
  },
};

app.start();
