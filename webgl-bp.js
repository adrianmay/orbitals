
    var gl, ext;
    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) 
            alert("Could not initialise WebGL, sorry :-(");
//        ext = getExtension("ANGLE_instanced_arrays");
//        if (!ext) 
//            alert("Could not initialise WebGL's instancing, sorry :-(");
    }

    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);
	}

    function initVars() {
	  var i;
	  for (i=0;i<as.length;i++) {
        shaderProgram[as[i]] = gl.getAttribLocation(shaderProgram, as[i]);
        gl.enableVertexAttribArray(shaderProgram[as[i]]);
	  }
	  for (i=0;i<us.length;i++) {
        shaderProgram[us[i]] = gl.getUniformLocation(shaderProgram, us[i]);
	  }
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    var lastTime = 0;

    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            rCube -= (9 * elapsed) / 1000.0;
        }
        lastTime = timeNow;
    }

    function tick() {
        requestAnimFrame(tick);
        drawScene();
        animate();
    }

    function webGLStart() {
        var canvas = document.getElementById("canvas");
        initGL(canvas);
        initShaders();
        initVars();
        initBuffers();

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    }

    function mod(n,m) {return ((n%m)+m)%m;}

    var vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
    function getExtension(name) {
	  var i, ext;
	  for(i in vendorPrefixes) {
			  ext = gl.getExtension(vendorPrefixes[i] + name);
			  if (ext) {
					  return ext;
			  }
	  }
	  return null;
    }

