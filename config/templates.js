module.exports = {
	templates: {
		template1: {
			id: "template1",
			title: "Template 1",
			visibility: "public", // customer ID or ID's who have access / "public" = all customers / "hidden" from all
			tags: ["test"],
			url: "..\\..\\statics\\previews\\template1\\preview.mp4", // video preview
			poster: "..\\..\\statics\\previews\\template1\\poster.png", // thumbnail
			type: "default",
			template: {
				src: "\\template1\\project.aep", // project file
				composition: "RENDER", // composition to render
				outputModule: "Lossless",
				startFrame: 0,
				endFrame: 2293,
				outputExt: "avi"
			},
			assets: [ // example transformations / displayName = frontend field label / chapterMarker = preview timecode
				{ type: "text", layerName: "CLIENT_NAME", property: "Source Text", displayName: "Customer Name", titleField: true, required: true, chapterMarker: "1.5" },
				{ type: "image", layerName: "clientLogo.png", composition: "*", displayName: "Customer Logo", required: true, chapterMarker: "1.5" },
        { type: "colour", layerName: "BRAND_PRIMARY", property: "Source Text", displayName: "Primary Background", required: true, chapterMarker: "19" },
				{ type: "audio", layerName: "audio_intro.wav", composition: "*", displayName: "Introduction Audio", required: true },
				{ type: "image", layerName: "mobileLogin.jpg", composition: "*", displayName: "Mobile Login", required: true, chapterMarker: "25"}
			],
			actions: {
				prerender: [
					{
						module: "@createvid/image-transform",
						input: "clientLogo.png",
						output: "clientLogo.png",
						operations: [
							{ type: 'resize', args: [400, 400] }
						]
					}
				]
			}
		}
	},
	rendering: {
		actions: {
			postrender: [
				{
					module: "@nexrender/action-encode",
					preset: "mp4",
					params: { "-vcodec": "libx264", "-r": 25, '-pix_fmt': 'yuv420p', '-movflags': '+faststart' },
					output: "encoded.mp4"
				}
			]
		}
	}
}
