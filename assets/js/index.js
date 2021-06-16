import {insertDaily, getDaily, getDailyByDate, getDayElapsed, insertSurvey, getSurvey, insertHasil, getHasil} from "./db.js";

// alert(window.screen.width);

function loadPage(page, data) {
	$('.wrapper').html('<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
	setTimeout(function() {
		$.ajax({
			type: 'get',
			url: `assets/page/${page}.html`,
			success: function(result) {
				$('.wrapper').html(result);
				loadScript(page);
			}		
		})
	}, 500);
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function parseDaily() {
	var d = new Date();
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
	var tanggal = d.getDate();
	var bulan = months[d.getMonth()];
	var tahun = d.getFullYear();
	var fullDate = tanggal + "/" + d.getMonth() + "/" + tahun;
	getDaily().then(data => {
		var result = '';
		if(data[0]) {
			var item = data.reverse();
			item.forEach(function(daily) {
				result += `<div class="catatan shadow daily-list mb-2" tanggal="${daily.fullDate}">
				<div class="info">
				<div class="box-icons g-blue">
				${daily.tanggal} ${daily.bulan}
				</div>
				<div class="deskripsi">
				<ul>`
				if(daily.merokok == 1) {
					result += `<li>Hari ini anda merokok</li><li>Habis ${daily.rokok} Batang Rokok</li>
					<li>Biaya Rp. ${daily.biaya}</li>`
				} else {
					result += `<li>Hari ini anda tidak merokok</li>`
				}
				result += `
				</ul>
				</div>
				</div>
				</div>`
			})
		} else {
			result += `<div class="catatan shadow">
			<div class="info">
			<div class="deskripsi">
			<div class="no">
			Belum ada data
			</div>
			</div>
			</div>
			</div>`
		}
		$('.list-catatan').html(result);
		$('.daily-list').click(function() {
			var tanggal = $(this).attr('tanggal');
			getDailyByDate(tanggal).then(data => {
				if(data.merokok == 1) {
					swal({
						text: data.alasan,
						buttons: {
							hapus: "OK",
						},
					})
				}
			})
		})
	})
}

function analyzeScore() {
	getSurvey().then(data => {
		var score = parseFloat(data.score);
		var keluarga = data.keluarga;
		var biaya = data.biaya;
		var hari = data.hari;
		var tanya = data.tanya;
		var hasil = '';
		var tips = '';
		if(score > parseFloat(0) && score <= parseFloat(0.9)) {
			hasil += 'Kondisi anda sangat buruk namun kami yakin anda bisa merubah keadaan anda, tetap semangat dalam merubah kebiasaan anda walupun berat. jalani dengan sedikit demi sedikit dan coba lakukan beberapa tips dibawah.';
		} else if(score >= parseFloat(1) && score <= parseFloat(1.9)) {
			hasil += 'Anda sedikit memiliki keinginan untuk menghindari rokok namun keinginan anda untuk merokok lebih besar. Coba sesering mungkin untuk mengingat dampak dari rokok saat keinginan untuk merokok muncul';
		} else if(score >= parseFloat(2) && score <= parseFloat(2.9)) {
			hasil += 'Kami yakin anda memiliki keinginan yang besar untuk berhenti merokok, untuk merealisasikannya gunakan dengan rutin setiap hari aplikasi ini, kami akan membantu anda.';
		} else if(score >= parseFloat(3) && score <= parseFloat(4)) {
			hasil += 'Kondisi anda sudah cukup baik dalam menghindari rokok, anda tinggal melakukan kebiasaan rutin yang bermanfaat agar keinginan anda untuk merokok hilang sepenuhnya.';
		}

		if(biaya > 0 && biaya <= 2) {
			tips += 'Coba untuk memikirkan barang yang dapat anda beli dengan berhenti merokok.';
		} else {
			tips += 'Hematlah uang anda untuk membeli keperluan lain yang dibutuhkan.';
		}

		if(hari > 0 && hari <= 2) {
			tips += ' Mulai hilangkan kebiasaan merokok dengan memakan permen.';
		} else {
			tips += ' Ketika ingin merokok coba untuk menahannya dan alihkan pikiran anda.';
		}

		if(keluarga == 0) {
			tips += ' Ingatlah orang terdekat anda jangan sampai mereka menjadi perokok pasif yang lebih beresiko.';
		} else {
			tips += ' Ingatlah keluarga anda jangan sampai mereka menjadi perokok pasif yang lebih beresiko.';
		}

		insertHasil(hasil, tips);		
	});
}

function checkData(tipe) {
	if(tipe == 'daily') {
		var d = new Date();
		var tanggal = d.getDate();
		var tahun = d.getFullYear();
		var fullDate = tanggal + "/" + d.getMonth() + "/" + tahun;
		getDailyByDate(fullDate).then(data => {
			if(data) {
				$('[name="jumlah"]').val(data.rokok);
				$('[name="harga"]').val(data.biaya);
				$('[name="alasan"]').val(data.alasan);
			}
		})
	}
}

function getQuotes() {
	$.ajax({
		type: 'get',
		url: `assets/data/quotes.json`,
		success: function(result) {
			var shuffled = shuffle(result);
			$('.quotes').html(`<div class="box-icon g-blue">
				<i class="fa fa-flag"></i>
				</div>
				${shuffled[0]}`);
		}		
	})
}

function setStats(data) {
	getSurvey().then(survey => {
		var uang;
		var totalUang;
		var rokok;
		var totalRokok;

		if(survey.biaya == 1) {
			uang = 25000;
		} else if(survey.biaya == 2) {
			uang = 20000;
		} else if(survey.biaya == 3) {
			uang = 15000;
		} else if(survey.biaya == 4) {
			uang = 10000;
		}

		if(survey.hari == 1) {
			rokok = 5
		} else if(survey.hari == 2) {
			rokok = 10;
		} else if(survey.hari == 3) {
			rokok = 15;
		} else if(survey.hari == 4) {
			rokok = 20;
		}

		totalUang = parseInt(uang) * parseInt(data);
		totalRokok = parseInt(rokok) * parseInt(data);
		
		$('.info-uang').html(totalUang);
		$('.info-rokok').html(totalRokok);
	})
}

function loadScript(page, data) {
	switch(page) {
		case 'home':
		analyzeScore();
		getDayElapsed().then(data => {
			$('#kartu-info').html(`${data}<span class="day ml-1">Hari</span>
				<div class="sub-info mt-4">
				Anda melewati ${data} hari tanpa rokok, Lanjutkan !
				</div>`)
			setStats(data);
		});
		$('.footer').show();
		getQuotes();
		break;

		case 'assesment':
		$('.footer').hide();
		$.ajax({
			type: 'get',
			url: `assets/data/survey.json`,
			success: function(result) {
				var data = '';
				var i = 2;
				result.forEach(function(soal) {
					var jawaban = shuffle(soal.jawaban)
					data += `<div class="sub-page">
					<div class="content">
					<div class="page-indicator">
					<div class="indicator soal-1 g-blue"></div>
					<div class="indicator soal-2"></div>
					<div class="indicator soal-3"></div>
					<div class="indicator soal-4"></div>
					<div class="indicator soal-5"></div>
					</div>
					<div class="cover-survey">
					<img src="assets/img/${soal.image}">
					<div class="title-survey my-4">
					${soal.text}
					</div>
					<div class="jawaban" style="margin: 30px 0;">
					<div class="row">`;
					jawaban.forEach(function(jwb) {
						data += `<div class="col-6 mb-2">
						<div class="btn-radio g-blue" score="${jwb.score}">${jwb.text}</div>
						</div>
						`
					})

					data += `
					<input type="hidden" id="score" value="0">
					<input type="hidden" id="keluarga" value="0">
					<input type="hidden" id="biaya" value="0">
					<input type="hidden" id="hari" value="0">
					<input type="hidden" id="tanya" value="0">
					<input type="hidden" id="rata" value="0">
					</div>
					</div>
					</div>
					<div class="btns g-blue btn-lanjut" data=${i++}>Selanjutnya</div>
					</div>
					</div>
					`
				})
				$('.page-wrap').append(data);
				$('.btn-cover').click(function() {
					if(window.screen.width <= 768) {
						$('.page-wrap').css({'left':'-100vw'});
					} else {
						$('.page-wrap').css({'left':'-50vw'});
					}
					
				})

				$('.btn-lanjut').click(function() {
					var i = $(this).attr('data');
					var keluarga = $('#keluarga').val();
					var biaya = $('#biaya').val();
					var hari = $('#hari').val();
					var tanya = $('#tanya').val();
					var rata = $('#rata').val();
					var score = $('.btn-radio.g-green').attr('score');
					if(window.screen.width <= 768) {
						var data = parseInt(i) * 100;
					} else {
						var data = parseInt(i) * 50;
					}
					
					if(!score) {
						if(i < 6) {
							swal({
								title: "Error",
								text: "Maaf silahkan isi jawaban anda",
								icon: "error",
								buttons: {
									hapus: "OK",
								},
							})
						} else {
							getSurvey().then(data => {
								var keluarga = parseInt(data.keluarga);
								var biaya = parseInt(data.biaya);
								var hari = parseInt(data.hari);
								var tanya = parseInt(data.tanya);
								var hasil = (biaya + hari + tanya) / 3;
								insertSurvey('survey', keluarga, biaya, hari, tanya, hasil);
							});
							loadPage('home');
						}
					} else {
						if(i < 6) {
							$('.page-wrap').css({'left':`-${data}vw`});
							$('.indicator').removeClass('g-blue');
							$('.btn-radio').removeClass('g-green');
							$(`.soal-${i}`).addClass('g-blue');
							if(i == 2) {
								$('#keluarga').val(score)
								insertSurvey('survey', score, biaya, hari, tanya, rata);
							} else if(i == 3) {
								$('#hari').val(score)
								insertSurvey('survey', keluarga, biaya, score, tanya, rata)
							} else if(i == 4) {
								$('#biaya').val(score)
								insertSurvey('survey', keluarga, score, hari, tanya, rata)
							} else if(i == 5) {
								$('#tanya').val(score)
								insertSurvey('survey', keluarga, biaya, hari, score, rata)
							}
						}
					}
				})
				$('.btn-radio').click(function() {
					$('.btn-radio').removeClass('g-green');
					$(this).addClass('g-green');
				})
			}		
		})
		break;

		case 'survey':
		getHasil().then(data => {
			$('.box-hasil').html(`<div class="box-icons mb-2 g-blue" style="padding: 1px">
				</div>
				${data.hasil}`)
			$('.box-tips').html(`<div class="box-icons mb-2 g-red" style="padding: 1px">
				</div>
				${data.tips}`)
		})

		$('.edit-btn').click(function() {
			$('.footer').hide();
			loadPage('assesment');
		})
		break;

		case 'daily':
		parseDaily();

		$('.btn-add').click(function() {
			$('.btn-add').css({'position':'absolute'});
			$('.footer,.btn-add').css({'opacity':'0','display':'none'});
			$('.btn-kembali').css({'display':'block','opacity':'1'});
			if(window.screen.width <= 768) {
				$('.page-wrap').css({'left':'-100vw'});
			} else {
				$('.page-wrap').css({'left':'-50vw'});
			}
			
			window.location.hash = '#tambah-catatan';
			checkData('daily');
		})
		$('.btn-kembali').click(function() {
			$('.btn-add').css({'position':'fixed'});
			$('.footer,.btn-add').css({'display':'block','opacity':'1'});
			$('.footer').css({'display':'flex'});
			$('.btn-kembali').css({'opacity':'0','display':'none'});
			$('.page-wrap').css({'left':'0'});
			window.location.hash = '';
		})
		window.onhashchange = function(data) {
			var url = document.URL;
			var str = url.split("/#");
			var page = str[1];
			if(!page) {
				$('.btn-kembali').click();
			}
		}

		$('[name="rokok"]').change(function() {
			if($(this).val() == 0) {
				$('[name="jumlah"]').attr('disabled', true);
				$('[name="harga"]').attr('disabled', true);
				$('[name="alasan"]').attr('disabled', true);
			} else {
				$('[name="jumlah"]').attr('disabled', false);
				$('[name="harga"]').attr('disabled', false);
				$('[name="alasan"]').attr('disabled', false);
			}
		})

		$("#btn-simpan").click(function() {
			var d = new Date();
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
			var tanggal = d.getDate();
			var bulan = months[d.getMonth()];
			var tahun = d.getFullYear();
			var fullDate = tanggal + "/" + d.getMonth() + "/" + tahun;
			var merokok = $('[name="rokok"]:checked').val();
			var rokok = $('[name="jumlah"]').val();
			var biaya = $('[name="harga"]').val();
			var alasan = $('[name="alasan"]').val();
			insertDaily(fullDate, tanggal, bulan, tahun, merokok, rokok, biaya, alasan);
			swal({
				title: "Sukses",
				text: "Data telah ditambahkan",
				icon: "success",
				buttons: {
					hapus: "OK",
				},
			}).then((value) => {
				switch (value) {
					case "hapus":
					parseDaily();
					$(".btn-kembali").click();
					break;
					default:
				}
			});
		})
		break;

		case "tips":
			$('.owl-carousel').owlCarousel({
			    loop:true,
			    margin:10,
			    nav:false,
			    dots:true,
			    responsive:{
			        0:{
			            items:1
			        },
			        600:{
			            items:2
			        }
			    }
			})

			$('.edukasi-1').click(function() {
				$('.box').css({'visibility':'visible', 'opacity':1});
				$('.tips-1').css({'display':'block'});
				$('.tips-2').css({'display':'none'});
				$('.tips-3').css({'display':'none'});
			})

			$('.edukasi-2').click(function() {
				$('.box').css({'visibility':'visible', 'opacity':1});
				$('.tips-1').css({'display':'none'});
				$('.tips-2').css({'display':'block'});
				$('.tips-3').css({'display':'none'});
			})

			$('.edukasi-3').click(function() {
				$('.box').css({'visibility':'visible', 'opacity':1});
				$('.tips-1').css({'display':'none'});
				$('.tips-2').css({'display':'none'});
				$('.tips-3').css({'display':'block'});
			})

			$('.close-btn').click(function() {
				$('.box').css({'visibility':'hidden', 'opacity':0});
				$('.tips-1').css({'display':'none'});
				$('.tips-2').css({'display':'none'});
				$('.tips-3').css({'display':'none'});
			})
		break;
	}
}

$(".nav-icon").click(function() {
	$(".nav-icon span").hide();
	var page = $(this).attr('data');
	$(`[data=${page}] span`).show();
	loadPage(page);
})

getSurvey().then(survey => {
	if(!survey) {
		$('.footer').hide();
		loadPage('assesment');
	} else {
		loadPage('home');
	}
})

new Typed('#typed',{
  strings : ['SMOKESTRONAUT'],
  typeSpeed : 100,
  delaySpeed : 100
});