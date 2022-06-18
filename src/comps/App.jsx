import React, {useState, useEffect, useRef} from "react";

function createShader(gl, type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

	if (success) {
		return shader;
	}

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	var success = gl.getProgramParameter(program, gl.LINK_STATUS);

	if (success) {
		return program;
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}
const VSHADER=" attribute vec4 a_position;\nvoid main() {\ngl_Position = a_position;\n}\n";
const FSHADER=" precision mediump float;\nvoid main() {\ngl_FragColor = vec4(1,0,0.5,1);\n}\n";

const App = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const gl = canvas.getContext("webgl");

		if (gl === null) {
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
			return;
		}

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		var vertexShader = createShader(gl, gl.VERTEX_SHADER, VSHADER.toString());
		var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FSHADER.toString());
		var program = createProgram(gl, vertexShader, fragmentShader);
		
		var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
		
		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		
		// three 2d points
		var positions = [
		  0, 0,
		  0, 0.5,
		  0.7, 0,
		];
		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


		gl.clear(gl.COLOR_BUFFER_BIT);
		// Tell it to use our program (pair of shaders)
		gl.useProgram(program);
		gl.enableVertexAttribArray(positionAttributeLocation);
		// Bind the position buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		 
		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		var size = 2;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.vertexAttribPointer(
		    positionAttributeLocation, 
		    size, 
		    type, 
		    normalize, 
		    stride, 
		    offset
		    )

		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 3;
		gl.drawArrays(primitiveType, offset, count);

		

 	}, []);

	return <canvas ref={canvasRef} style={{width: "100%",height: "100%"}}/>;
}

export default App;