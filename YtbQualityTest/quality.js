
////////////////////////////////////////////////////////////////////////////////////////////////
function createYoutubeVideoFmtMeta() {
	var vid = getYoutubeVideoId();
	var ret = [];
	// check meta exist and content
	var meta = $('meta[name="ext_hg_' + vid + ',adaptive_fmts,ext_id_' + extid + '"]', 'head');
	if (meta.length == 1) {
		ret = getYoutubeVideoFmtInMetaContent(meta);
		if (ret.length > 0) {
			return ret;
		}
		else {
			meta.remove();
		}
	}
	// create script for appending meta, then remove script itself
	try {
		var inDBG = true;
		var scriptid = 'ext_hg_script_' + extid;
		var a = document.createElement('script');
		a.type = 'text/javascript';
		a.id = scriptid;
		var s = 'var ext_hg_fmt_meta = document.createElement("meta"); \
				ext_hg_fmt_meta.name = "ext_hg_' + vid + ',ext_id_' + extid + '"; \
				ext_hg_fmt_meta.content = ytplayer.config.args.fmt_list; \
				if (ytplayer.config.args.video_id == "' + vid + '") { \
					document.head.appendChild(ext_hg_fmt_meta); \
				} \
				var ext_hg_fmt_script_itself = document.getElementById("' + scriptid + '"); \
				try { \
					if (' + inDBG + ') { \
						console.log("write meta with content", ytplayer.config.args.fmt_list); \
					} \
				} \
				catch (ex) { } \
				var ext_hg_adaptive_fmts_meta = document.createElement("meta"); \
				ext_hg_adaptive_fmts_meta.name = "ext_hg_' + vid + ',adaptive_fmts,ext_id_' + extid + '"; \
				var ext_hg_adaptive_fmts = ytplayer.config.args.adaptive_fmts; \
				var ext_hg_split1 = ext_hg_adaptive_fmts.split(","); \
				var ext_hg_adaptive_array = []; \
				for (var i = 0; i < ext_hg_split1.length; i += 1) { \
					var split = ext_hg_split1[i].split("&"); \
					for (var j = 0; j < split.length; j+= 1) { \
						var split2 = split[j]; \
						switch(split2) { \
							case "itag=264": \
								ext_hg_adaptive_array.push("264/1440p"); \
								break; \
							case "itag=138": \
								ext_hg_adaptive_array.push("138/original"); \
								ext_hg_adaptive_array.push("38/original"); \
								break; \
							case "itag=137": \
								ext_hg_adaptive_array.push("137/1080p"); \
								ext_hg_adaptive_array.push("37/1080p"); \
								break; \
							case "itag=136": \
								ext_hg_adaptive_array.push("136/720p"); \
								ext_hg_adaptive_array.push("22/720p"); \
								break; \
							case "itag=135": \
								ext_hg_adaptive_array.push("135/135/480p"); \
								break; \
							case "itag=134": \
								ext_hg_adaptive_array.push("134/360p"); \
								ext_hg_adaptive_array.push("18/360p"); \
								break; \
							case "itag=133": \
								ext_hg_adaptive_array.push("133/133/240p"); \
								break; \
							case "itag=160": \
								ext_hg_adaptive_array.push("160/160/144p"); \
								break; \
						} \
					} \
				} \
				ext_hg_adaptive_fmts_meta.content = ext_hg_adaptive_array.toString(); \
				document.head.appendChild(ext_hg_adaptive_fmts_meta); \
				document.head.removeChild(ext_hg_fmt_script_itself); ';
		a.innerHTML = s;
		document.head.appendChild(a);
	}
	catch (ex) {
		toDBG4(function () { console.log('@createYoutubeVideoFmtMeta() ERROR, create script fail, ex:', ex); });
		ret = [];
	}
	return ret;
}

////////////////////////////////////////////////////////////////////////////////////////////////
function getYoutubeVideoFmtInMetaContent(meta) {
	var content = meta.attr('content');
	var split = content.split(',');
	var ret = [];
	$.each(split, function (i, v) {
		ret.push(v.split('/')[0]);
	});
	if (ret.length > 0) {
		return ret;
	}
	return [];
}
