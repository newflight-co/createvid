module.exports = {
	templates: {
		flyby: {
			id: "flyby",
			title: "Fly By",
			visibility: ['ciphr.com'],
			tags: ["prospects"],
			url: "..\\..\\statics\\previews\\flyby\\preview.mp4",
			poster: "..\\..\\statics\\previews\\flyby\\poster.png",
			type: "default",
			template: {
				src: "\\flyby\\project.aep",
				composition: "RENDER",
				outputModule: "Lossless",
				startFrame: 0,
				endFrame: 2293,
				outputExt: "avi"
			},
			assets: [
				{ type: "text", layerName: "CLIENT_NAME", property: "Source Text", displayName: "Customer Name", titleField: true, required: true, chapterMarker: "1.5" },
				{ type: "image", layerName: "clientLogo.png", composition: "*", displayName: "Customer Logo", required: true, chapterMarker: "1.5" },
				{ type: "image", layerName: "dashboard.jpg", composition: "*", displayName: "Dashboard", required: true, chapterMarker: "37"}, 
				{ type: "image", layerName: "employeeDirectory.jpg", composition: "*", displayName: "Employee Directory", required: true, chapterMarker: "13"},
				{ type: "image", layerName: "globalWhosOff.jpg", composition: "*", displayName: "Global Who's Off", required: true, chapterMarker: "64"},
				{ type: "image", layerName: "personalDetails.jpg", composition: "*", displayName: "Personal Details", required: true, chapterMarker: "42"},
				{ type: "image", layerName: "mobileDashboard.jpg", composition: "*", displayName: "Mobile Dashboard", required: true, chapterMarker: "32"},
				{ type: "image", layerName: "mobileEmployeeDetails.jpg", composition: "*", displayName: "Mobile Employee Details", required: true, chapterMarker: "70"},
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
					},
					{
						module: "@createvid/image-transform",
						input: "dashboard.jpg",
						output: "dashboard.jpg",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
						module: "@createvid/image-transform",
						input: "employeeDirectory.jpg",
						output: "employeeDirectory.jpg",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
						module: "@createvid/image-transform",
						input: "globalWhosOff.jpg",
						output: "globalWhosOff.jpg",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
						module: "@createvid/image-transform",
						input: "personalDetails.jpg",
						output: "personalDetails.jpg",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
						module: "@createvid/image-transform",
						input: "mobileDashboard.jpg",
						output: "mobileDashboard.jpg",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
						module: "@createvid/image-transform",
						input: "mobileDashboard.jpg",
						output: "mobileDashboard.jpg",
						operations: [
							{ type: 'resize', args: [null, 2000] }
						]
					},
					{
						module: "@createvid/image-transform",
						input: "mobileEmployeeDetails.jpg",
						output: "mobileEmployeeDetails.jpg",
						operations: [
							{ type: 'resize', args: [null, 2000] }
						]
					},
					{
						module: "@createvid/image-transform",
						input: "mobileLogin.jpg",
						output: "mobileLogin.jpg",
						operations: [
							{ type: 'resize', args: [null, 2000] }
						]
					}
				]
			}
		},
		flyby_fast: {
			id: "flyby_fast",
			visibility: ['ciphr.com'],
			tags: ["prospects"],
			title: "Fly By - Fast",
			url: "..\\..\\statics\\previews\\flyby\\preview.mp4",
			poster: "..\\..\\statics\\previews\\flyby\\poster.png",
			type: "default",
			template: {
				src: "\\flyby\\project-fast.aep",
				composition: "RENDER",
				outputModule: "Lossless",
				startFrame: 0,
				endFrame: 2293,
				outputExt: "avi"
			},
			assets: [
				{ type: "text", layerName: "CLIENT_NAME", property: "Source Text", displayName: "Customer Name", titleField: true, required: true, chapterMarker: "1.5" },
				{ type: "colour", layerName: "BRAND_PRIMARY", property: "Source Text", displayName: "Primary Background", required: true, chapterMarker: "19" },
				{ type: "colour", layerName: "BRAND_SECONDARY", property: "Source Text", displayName: "Secondary Background", required: true, chapterMarker: "19" },
				{ type: "colour", layerName: "ICON_PRIMARY", property: "Source Text", displayName: "Primary Text Colour", required: true, chapterMarker: "19" },
				{ type: "colour", layerName: "TEXT_PRIMARY", property: "Source Text", displayName: "Secondary Text Colour", required: true, chapterMarker: "19" },
				{ type: "image", layerName: "clientLogo.png", composition: "*", displayName: "Customer Logo", required: true, chapterMarker: "1.5" },
				{ type: "image", layerName: "dashboard-bkg.png", composition: "*", displayName: "Dashboard Background", chapterMarker: "37" },
				{ type: "image", layerName: "employee_directory-bkg.png", composition: "*", displayName: "Employee Directory Background", chapterMarker: "13" },
				{ type: "image", layerName: "global_whos_off-bkg.png", composition: "*", displayName: "Global Who's Off Background", chapterMarker: "64" },
				{ type: "image", layerName: "personal_details-bkg.png", composition: "*", displayName: "Personal Details Background", chapterMarker: "42" },
				{ type: "image", layerName: "mobile_dashboard-bkg.png", composition: "*", displayName: "Mobile Dashboard Background", chapterMarker: "32" },
				{ type: "image", layerName: "mobile_personal_details-bkg.png", composition: "*", displayName: "Mobile Employee Details Background", chapterMarker: "70" },
				{ type: "image", layerName: "mobile_login-bkg.png", composition: "*", displayName: "Mobile Login Background", chapterMarker: "25" }
			],
			actions: {
				prerender: [
					{
						module: "@createvid/image-transform",
						input: "clientLogo.png",
						output: "clientLogo.png",
						operations: [
							{ type: 'resize', args: [600, 400] }
						]
					},
					{
            			ignoreErrors: true,
						module: "@createvid/image-transform",
						input: "dashboard-bkg.jpg",
						output: "dashboard-bkg.jpg",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
            			ignoreErrors: true,
						module: "@createvid/image-transform",
						input: "employee_directory-bkg.png",
						output: "employee_directory-bkg.png",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
           				ignoreErrors: true,
						module: "@createvid/image-transform",
						input: "global_whos_off-bkg.jpg",
						output: "global_whos_off-bkg.jpg",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
            			ignoreErrors: true,
						module: "@createvid/image-transform",
						input: "personal_details-bkg.png",
						output: "personal_details-bkg.png",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
            			ignoreErrors: true,
						module: "@createvid/image-transform",
						input: "mobile_dashboard-bkg.jpg",
						output: "mobile_dashboard-bkg.jpg",
						operations: [
							{ type: 'resize', args: [1920, null] }
						]
					},
					{
            			ignoreErrors: true,
						module: "@createvid/image-transform",
						input: "mobile_employee_details-bkg.png",
						output: "mobile_employee_details-bkg.png",
						operations: [
							{ type: 'resize', args: [1127, 800] }
						]
					},
					{
            			ignoreErrors: true,
						module: "@createvid/image-transform",
						input: "mobile_login-bkg.png",
						output: "mobile_login-bkg.png",
						operations: [
							{ type: 'resize', args: [null, 2000] }
						]
					}
				]
			}
		},
		test: {
			id: "test",
			visibility: "hidden",
			tags: ["training", "academny"],
			title: "Test Features",
			url: "..\\..\\statics\\previews\\test\\preview.mp4",
			poster: "..\\..\\statics\\previews\\test\\poster.png",
			template: {
				"src": "\\test\\project.aep",
				"composition": "RENDER",
				"startFrame": 0,
				"endFrame": 180,
				"outputExt": "avi"
			},
			assets: [
				{ type: "text", layerName: "TEXT_CONTROL", property: "Source Text", displayName: "Test Text", titleField: true, required: true },
				{ type: "text", layerName: "none", displayName: "Test Unrequired Field" }, // not required field
				{ type: "colour", layerName: "COLOUR_CONTROL", property: "Source Text", displayName: "Test Colour", required: true },
				{ type: "image", layerName: "image.jpg", composition: "*", displayName: "Test Image", required: true }
			],
			actions: {
				prerender: [
					{
						module: "@createvid/image-transform",
						input: "image.jpg",
						output: "image.jpg",
						operations: [
							{type: 'resize', args: [1200, 800]}
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
				// {
				// 	"module": "@nexrender/action-encode",
				// 	"params": { "-vframes": "1", "-ss": "00:00:01.000" }, // this would be awesome at 30% rather than a specific time
				// 	"input": "encoded.mp4",
				// 	"output": "thumb.jpg"
				// }
			]
		}
	}
}
