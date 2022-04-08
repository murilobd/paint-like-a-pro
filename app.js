var inputCanvas = document.querySelector("canvas#input"),
	  outputCanvas = document.querySelector("canvas#output"),
	  outputCanvasStyle = document.querySelector("canvas#outputStyle"),
	  paintBtn = document.querySelector("button#paintBtn"),
	  styleBtn = document.querySelector("button#styleBtn"),
	  downloadBtn = document.querySelector("button#downloadBtn"),
	  clearBtn = document.querySelector("button#clearBtn"),
	  uploadFile = document.querySelector("input#uploadFile"),
	  statusText = document.querySelector("span#status"),
	  brushSize = document.querySelector("input#brushSize"),
	  mainModel, // pix2pix model
	  transferStyleEnabled = new URLSearchParams(window.location.search).has('transferStyle'),
	  styleNetModel,
	  transformModel,
	  selectedStyleImg = "style1";

function changeBrushSize() {
	console.log(arguments);
}

function changedBrushColor(color) {
	const ctx = inputCanvas.getContext('2d');
	ctx.strokeStyle = color;
}

function changedStyle(style) {
	selectedStyleImg = style;
}

function enableButton(buttonElement, onClickCallback) {
	buttonElement.removeAttribute("disabled");
	if (onClickCallback) {
		buttonElement.addEventListener('click', onClickCallback);
	}
}

async function loadPix2PixModel() {
	console.group("loading-model");
	try {
		console.log("loading model");
		mainModel = await tf.loadLayersModel("./tf-models/my-model-h5-final/model.json");
		enableButton(paintBtn, function() {
			paintWithPix2PixModel();
		});
		console.log("model loaded");
	} catch (error) {
		console.error(error);
	}
	console.groupEnd("loading-model");
}

async function loadTransferStyleModel() {
	console.group("loading-style-model");
	try {
		console.log("loading style transfer models");
		styleNetModel = await tf.loadGraphModel("./tf-models/saved_model_style_js/model.json");
		transformModel = await tf.loadGraphModel("./tf-models/saved_model_transformer_js/model.json");
		enableButton(styleBtn, function() {
			transferStyle();
		});
		console.log("style transfer models loaded");
	} catch (error) {
		console.log(error)
	}
	console.groupEnd("loading-style-model");
}


function preprocessInput(input) {
	return tf.tidy(() => {
		return input.toFloat().div(tf.scalar(255)).expandDims();
		const PREPROCESS_DIVISOR = tf.scalar(255 / 2);
		const preprocessedInput = tf.div(
			tf.sub(input.asType('float32'), PREPROCESS_DIVISOR),
			PREPROCESS_DIVISOR);
		return preprocessedInput.reshape([1, ...preprocessedInput.shape]);
	});
}
async function paintWithPix2PixModel() {
	console.time('process');
	const pixels = preprocessInput(
		tf.browser.fromPixels(inputCanvas)
	);
	const prediction = await mainModel.apply(pixels, {
		training: true,
	});
	const output = tf.cast(prediction.mul(0.5).add(0.5).mul(255), "int32");
	await tf.browser.toPixels(output.squeeze(), outputCanvas);
	console.timeEnd('process');
}

async function transferStyle() {
	// const img = new Image();
	// img.onload = async function() {
		const img = document.querySelector("img#" + selectedStyleImg);
		const bottleneck = await tf.tidy(() => {
			return styleNetModel.predict(preprocessInput(tf.browser.fromPixels(img)));
		});
		await tf.nextFrame();
		const stylized = await tf.tidy(() => {
		  return transformModel.predict([preprocessInput(tf.browser.fromPixels(outputCanvas)), bottleneck]).squeeze();
		});
		await tf.browser.toPixels(stylized, outputCanvasStyle);
		bottleneck.dispose();  // Might wanna keep this around
		stylized.dispose();
	// }
	// img.src = "imgs/" + selectedStyleImg + ".jpg";
}

async function init() {
	statusText.innerText = "Loading... wait, please";
	enableDrawCanvas(inputCanvas);
	await loadPix2PixModel();
	
	// if is to show transferStyle, show all inputs and load model
	if (transferStyleEnabled) {
		await loadTransferStyleModel();
		const allHidden = document.querySelectorAll("[style*='display:none']");
		allHidden.forEach(el => el.style.display = null);
	}

	brushSize.addEventListener("change", function(event) {
		const ctx = inputCanvas.getContext('2d');
		ctx.lineWidth = event.target.value;
	});

	uploadFile.addEventListener('change', function () {
		const file = uploadFile.files[0];
		const img = new Image()
		img.onload = function() {
			// clear canvas
			const ctx = inputCanvas.getContext('2d');
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, inputCanvas.width, inputCanvas.height);
			// add image to canvas
			ctx.drawImage(img, 0, 0);
		}
		img.src = URL.createObjectURL(file);
	});

	enableButton(clearBtn, function() {
		const ctx = inputCanvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, inputCanvas.width, inputCanvas.height)
	});
	enableButton(downloadBtn, function() {
		[inputCanvas, outputCanvas, transferStyleEnabled && outputCanvasStyle].filter(Boolean).forEach((canvas, index) => {
			const names = [
				"sketch.png",
				"paint.png",
				"paint_styled.png"
			].filter(Boolean)
			const link = document.createElement('a');
			link.download = names[index];
			link.href = canvas.toDataURL();
			link.click();
			link.delete;
		})
	});

	console.time("initiate model");
	await mainModel.apply(preprocessInput(
		tf.browser.fromPixels(inputCanvas)
	));
	console.timeEnd("initiate model");

	statusText.innerText = "Good to go!"

	// const img = new Image()
	// img.onload = () => {
	// 	inputCanvas.getContext('2d').drawImage(img, 0, 0);
	// }
	// img.src = "./imgs/10.jpg";
}