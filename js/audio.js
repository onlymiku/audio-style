// JavaScript Document
$(function(){
	
	/****播放器盒子模板 start
	<div class="audio_box">
		<div class="audio_con">
			<div class="audio_src">
				<audio src="img/Phantom (팬텀) - Burning (正在燃烧).mp3" controls preload="auto">
					你的游览器不支持该标签
				</audio>
			</div>
			<div class="audio_panel">
				<div class="audio_play">
					<a href="javascript:;" title="play"></a>
				</div>
				<div class="audio_time audio_startTime">
					<span>00:00</span>
				</div>
				<div class="audio_rail">
					<p class="audio_rail_slider">
						<a href="javascript:;" class="rail_slider_total"></a>
						<a href="javascript:;" class="rail_slider_load"></a>
						<a href="javascript:;" class="rail_slider_current"></a>
						<span class="time_float">
							<span>00:00</span>
						</span>
					</p>
				</div>
				<div class="audio_time audio_endTime">
					<span>00:00</span>
				</div>
				<div class="audio_mute">
					<a href="javascript:;" title="静音"></a>
				</div>
				<div class="audio_sound">
					<p class="audio_sound_slider">
						<a href="javascript:;" class="sound_total"></a>
						<a href="javascript:;" class="sound_current"></a>
					</p>
				</div>
			</div>
		</div>
	</div>
	播放器盒子模板 end*****/
	
	/* = audio播放器初始化
	------------------------------------------------------*/
	var audioList = $(".audio_box audio");
	if(audioList.length > 0){
		for(var i =0; i<audioList.length; i++){
			//创建播放器盒子
			var audio_con = $("<div class='audio_con'></div>");
			var audio_panel = $("<div class='audio_panel'></div>");
			var audio_play = $("<div class='audio_play'><a href='javascript:;' title='play'></a></div>");
			var audio_startTime = $("<div class='audio_time audio_startTime'><span>00:00</span></div>");
			var audio_rail = $("<div class='audio_rail'></div>");
			var audio_rail_slider = $("<p class='audio_rail_slider'></div>");
			var time_float = $("<span class='time_float'><span>00:00</span></div>");
			audio_rail_slider.append("<a href='javascript:;' class='rail_slider_total'></a>");
			audio_rail_slider.append("<a href='javascript:;' class='rail_slider_load'></a>");
			audio_rail_slider.append("<a href='javascript:;' class='rail_slider_current'></a>");
			audio_rail_slider.append(time_float);
			audio_rail.append(audio_rail_slider);
			var audio_endTime = $("<div class='audio_time audio_endTime'><span>00:00</span></div>");
			var audio_mute = $("<div class='audio_mute'><a href='javascript:;' title='静音'></a></div>");
			var audio_sound = $("<div class='audio_sound'></div>");
			
			var audio_sound_slider = $("<p class='audio_sound_slider'></div>");
			audio_sound_slider.append("<a href='javascript:;' class='sound_total'></a>");
			audio_sound_slider.append("<a href='javascript:;' class='sound_current'></a>");
			audio_sound.append(audio_sound_slider);
			
			audio_panel.append(audio_play);
			audio_panel.append(audio_startTime);
			audio_panel.append(audio_rail);
			audio_panel.append(audio_endTime);
			audio_panel.append(audio_mute);
			audio_panel.append(audio_sound);
			
			audio_con.append(audio_panel);
			audio_con.append($(".audio_box").eq(i).find("audio"));
			
			$(".audio_box").eq(i).append(audio_con);
			
			//audioList.eq(i).get(0)，$(".audio_box audio").eq(i).get(0)和$(".audio_box").eq(i).find("audio").get(0)取得的值一样= =！
			//设置播放器默认声音大小为0.5
			audioList.eq(i).get(0).volume = 0.5;
			//设置播放器不进行预加载
			audioList.eq(i).get(0).preload = "none";
			
		}
	}
	
	
	/* = 播放/暂停
	------------------------------------------------------*/
	$(".audio_play a").click(function(){
		audioPlay($(this).parents(".audio_con"));
	});

	/* = 鼠标在进度条移动浮动时间的显示
	-----------------------------------------------------*/
	$(".audio_rail_slider").mousemove(function(ev){
		timeFloatShow(this,$(this).parents(".audio_con"),ev);
	});
	
	/* = 跳转到指定位置
	-----------------------------------------------------*/
	//注意这里传入的值不是dom对象 是一个html元素
	$(".audio_rail_slider").click(function(ev){
		adjustPorgress(this,$(this).parents(".audio_con"),ev);
	});
	
	/* = 调节音量
	-----------------------------------------------------*/
	$(".audio_sound_slider").click(function(ev){
		adjustVolume(this,$(this).parents(".audio_con"),ev);
	});
	
	/* = 静音
	-----------------------------------------------------*/
	$(".audio_mute a").click(function(){
		mute($(this).parents(".audio_con"));
	});
	
	/* = 鼠标移入浮动时间显示
	-----------------------------------------------------*/
	$(".audio_rail_slider").hover(
		function(ev){
			timeFloatShow(this,$(this).parents(".audio_con"),ev);
		},
		function(){
			$(this).parents(".audio_con").find(".time_float").hide(100);
		}
	);
	
	/* = 播放/暂停函数
	------------------------------------------------------*/
	function audioPlay(audioCon){
		audioLoad(audioCon);
		if(audioCon.find("audio").get(0).paused){
			audioCon.find(".audio_play a").css("background-position","0px -16px");
			audioCon.find("audio").get(0).play();
		}else{
			audioCon.find(".audio_play a").css("background-position","0px 0px");
			audioCon.find("audio").get(0).pause();
		}
	}
	
	/* = 初始化播放器的一些属性
	------------------------------------------------------*/
	function audioLoad(audioCon){
		//播放器开始播放时 加载缓冲 playing：当开始播放时
		audioCon.find("audio").get(0).addEventListener('playing',function(){
			bufferBar(audioCon);	
		});
		//进度条 addEventListener添加事件 timeupdate：当前歌曲播放时间变化时，触发事件 Progress：进度条函数
		audioCon.find("audio").get(0).addEventListener('timeupdate',function(){
			progress(audioCon);
			playEnd(audioCon);
		});
	}
	
	/* = 静音函数
	-----------------------------------------------------*/
	function mute(audioCon){
		//这里的.muted方法 静音返回true 否则返回false
		if(audioCon.find("audio").get(0).muted){
			audioCon.find(".audio_mute a").css("background-position","-16px -16px");
			audioCon.find(".sound_current").css("display","block");	
			audioCon.find("audio").get(0).muted = false;
		}else{
			audioCon.find(".audio_mute a").css("background-position","-16px 0px");
			audioCon.find(".sound_current").css("display","none");
			audioCon.find("audio").get(0).muted = true;
		}
	}
	
	/* = 浮动时间显示函数
	-----------------------------------------------------*/
	function timeFloatShow(dom,audioCon,ev){
		
		//判断资源是否加载完成 如果没有 则时间显示00:00
		if(audioCon.find("audio").get(0).readyState !== 4){
			//资源加载完成 点击进度条时会进入这里面（不知道为啥），所以时间值会变成00:00 故注销
			//audioCon.find(".time_float span").text("00:00");
			audioCon.find(".time_float").css("left",progressX);
			audioCon.find(".time_float").show(100);
			return;
		}
		var ev = window.event || ev;
		var progressX = ev.clientX - dom.getBoundingClientRect().left;
		
		var total = audioCon.find("audio").get(0).duration;//获取歌曲总长度
		var width = audioCon.find(".rail_slider_total").width();
		
		//鼠标移入地方的时间
		var Time = (progressX/width)*total;
		//获取分和秒
		var currentTimeMin = parseInt(Time/60);
		var currentTimeSecond = parseInt(Time%60);
		
		if(currentTimeMin<10){
			currentTimeMin = "0"+currentTimeMin;
		}
		if(currentTimeSecond<10){
			currentTimeSecond = "0"+currentTimeSecond;
		}
		audioCon.find(".time_float span").text(currentTimeMin+":"+currentTimeSecond);
		audioCon.find(".time_float").css("left",progressX);
		audioCon.find(".time_float").show(100);
	}
		
	/* = 进度条/时间的显示
	-----------------------------------------------------*/
	function progress(audioCon){
		var total = audioCon.find("audio").get(0).duration;//获取歌曲总长度
		var current = audioCon.find("audio").get(0).currentTime;//获取歌曲当前长度
		var slider_total = audioCon.find(".rail_slider_total").width();//获取进度条的总长度
		var slider_current = audioCon.find(".rail_slider_current").width();//获取进度条的当前长度
		
		//获取分和秒
		var totalTimeMin = parseInt(total/60);
		var totalTimeSecond = parseInt(total%60);
		//获取分和秒
		var currentTimeMin = parseInt(current/60);
		var currentTimeSecond = parseInt(current%60);
		
		if(totalTimeMin<10){
			totalTimeMin = "0"+totalTimeMin;
		}
		if(totalTimeSecond<10){
			totalTimeSecond = "0"+totalTimeSecond;
		}
		
		if(currentTimeMin<10){
			currentTimeMin = "0"+currentTimeMin;
		}
		if(currentTimeSecond<10){
			currentTimeSecond = "0"+currentTimeSecond;
		}
		
		audioCon.find(".audio_startTime span").text(currentTimeMin+":"+currentTimeSecond);
		audioCon.find(".audio_endTime span").text(totalTimeMin+":"+totalTimeSecond);
		
		audioCon.find(".rail_slider_current").width((current/total)*slider_total);
	}
	
	/* = 缓冲条显示
	-----------------------------------------------------*/
	function bufferBar(audioCon){
		var temp = audioCon.find("audio").get(0);
		bufferTimer = setInterval(function(){
			var bufferIndex = temp.buffered.length;
			if (bufferIndex > 0 && temp.buffered !== undefined) {
				//console.log("end:"+temp.buffered.end(bufferIndex-1)+"===="+"leng:"+temp.duration);
				//buffered 属性返回 TimeRanges 对象。缓冲范围。
				//TimeRanges 对象表示用户的音视频缓冲范围。
				//缓冲范围指的是已缓冲音视频的时间范围。如果用户在音视频中跳跃播放，会得到多个
				//end(index) - 获得某个已缓冲范围的结束位置 首个缓冲范围的下表是 0。
				var bufferValue = temp.buffered.end(bufferIndex-1)/temp.duration*audioCon.find(".rail_slider_total").width();
				audioCon.find(".rail_slider_load").width(parseInt(bufferValue));
				
				//缓冲完成
				if (Math.abs(temp.duration - temp.buffered.end(bufferIndex-1)) <1) {
					audioCon.find(".rail_slider_load").width(audioCon.find(".rail_slider_total").width());
					clearInterval(bufferTimer);
				}
			}
		},500);
	}
	/* = 播放完成
	-----------------------------------------------------*/
	function playEnd(audioCon){
		if(audioCon.find("audio").get(0).ended){
			audioCon.find(".audio_play a").css("background-position","0px 0px");
		}
	}
	
	/* = 调整播放进度
	-----------------------------------------------------*/
	/*
		adjustPorgress			需要3个参数，
		dom：					当前进度条的html元素 注意不是obj对象
		audioCon：				当前播放器的父级元素
		ev：						点击事件里面的函数？？？？
		getBoundingClientRect 	这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
	*/
	function adjustPorgress(dom,audioCon,ev){
			
		//判断资源是否加载完成 如果没有 则时间显示00:00
		if(audioCon.find("audio").get(0).readyState !== 4){
			return;
		}
		
		var ev = window.event || ev;
		var progressX = ev.clientX - dom.getBoundingClientRect().left;
		var temp =audioCon.find("audio").get(0);
		temp.currentTime = parseInt(progressX/audioCon.find(".rail_slider_total").width()*temp.duration);
		//调整进度条长度
		audioCon.find(".rail_slider_current").width((temp.currentTime/temp.duration)*audioCon.find(".rail_slider_total").width());
	}
	
	/* = 音量大小调节
	-----------------------------------------------------*/
	function adjustVolume(dom,audioCon,ev){
		var ev = window.event || ev;
		var volumeX = ev.clientX - dom.getBoundingClientRect().left;
		var temp =audioCon.find("audio").get(0);
		//audio的音量大小在0-1之间
		//toFixed 四舍五入 toFixed(2)保留后两位
		temp.volume = (volumeX/audioCon.find(".audio_sound_slider").width()).toFixed(2);
		audioCon.find(".sound_current").width(volumeX);
	}
});
	