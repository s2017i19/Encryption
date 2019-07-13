var dbCodeBoard = [];
dbCodeBoard[0] = []; //2차원 배열 선언
dbCodeBoard[1] = [];
dbCodeBoard[2] = [];
dbCodeBoard[3] = [];
dbCodeBoard[4] = [];
var singCodeBoard = [];
var keyResult = "";
var blankCheck = [];
var zCheck = [];

function init(what) {
    var key = document.getElementById("key").value;
    var sentence = document.getElementById("sentence").value;
    var b=0, z=0;
    window.blankCheck = [];
    window.zCheck = [];

    if(what=="double") {
        makeDoubleBoard(key);
        for (var i = 0; i < sentence.length; i++) {
            if (sentence.charAt(i) == 'z') { //z를 q로 바꿔서 처리
                zCheck[z] = i;
                z++;
                sentence = sentence.substring(0, i) + 'q' + sentence.substring(i+1, sentence.length);
            }
        }
    } else if(what=="single") {
        makeSingleBoard(key);
    }

    for (var i = 0; i < sentence.length; i++) {
        if (sentence.charAt(i) == ' ') { //공백 제거
            sentence = sentence.substring(0, i) + sentence.substring(i+1, sentence.length);
            blankCheck[b] = i;
            b++;
        }
    }

    if(what=="double") encryption = DoubleEncryption(key, sentence);
    else if(what=="single") encryption = SingleEncryption(key, sentence);

    document.getElementById("encText").innerHTML = encryption;

    for (var i = 0; i < encryption.length ; i++ ) {
        if (encryption.charAt(i) == ' ') //공백제거
            encryption = encryption.substring(0, i) + encryption.substring(i + 1, encryption.length);
    }

    if(what=="double") {
        decryption = DoubleDecryption(key, encryption);

        for(var i=0; i<blankCheck.length; i++) {
            for(var j=0; j<decryption.length; j++) {
                if(blankCheck[i] == j) {
                    decryption = decryption.substring(0, j) + " " + decryption.substring(j, decryption.length);
                    blankCheck[i+1] += i+1;
                }
            }
        }
    } else if(what=="single") {
        decryption = SingleDecryption(key, encryption);

        for(var i=0; i<blankCheck.length; i++) {
            for(var j=0; j<decryption.length; j++) {
                if(blankCheck[i] == j) {
                    decryption = decryption.substring(0, j) + " " + decryption.substring(j, decryption.length);
                }
            }
        }
    }

    document.getElementById("decText").innerHTML = decryption;

    return false;
}


/*
==========================================
쌍자치환
==========================================
*/
function makeDoubleBoard(alpa) {
    var keyCount = 0;
    var overlap = false; //문자 중복
    keyResult = "";

    alpa += "abcdefghijklmnopqrstuvwxyz";

    //문자열 중복 검사
    for(var i=0; i<alpa.length; i++) {
		for(var j=0; j<keyResult.length; j++) {
			if(alpa.charAt(i)==keyResult.charAt(j)) {
				overlap = true;
				break;
			}
		}
		if(!overlap) keyResult += alpa.charAt(i);
		overlap = false;
    }

	//배열에 대입
	for(var i=0; i<dbCodeBoard.length; i++) {
		for(var j=0; j<5; j++) {
            dbCodeBoard[i][j] = keyResult.charAt(keyCount++);
            
            document.getElementById(keyCount).innerHTML = dbCodeBoard[i][j];
		}
    }

    return false;
}

function DoubleEncryption(key, sentence){
    var arr = [];
    var encArr = [];
    var x1=0, x2=0, y1=0, y2=0;
    var encResult ="";
    document.getElementById("ready").innerHTML = "";

    for(var i=0; i<sentence.length; i++) { 
        var twoWord = [];
        twoWord[0] = sentence.charAt(i);
        if(sentence.charAt(i)==sentence.charAt(i+1)) { //문자가 반복되면 x 추가
            twoWord[1] = 'x';
        } else if(i == sentence.length-1) {
            twoWord[1] = 'x';
        } else {
            twoWord[1] = sentence.charAt(i+1);
            i++;
        }
        arr.push(twoWord);
        document.getElementById("ready").innerHTML += twoWord[0]+twoWord[1]+" ";
    }

    for(var i=0; i<arr.length; i++) {
        var tmp = [];

        for(var j=0; j<dbCodeBoard.length; j++) { //쌍자암호의 각각 위치체크
            for(var k=0; k<dbCodeBoard[j].length; k++) {
                if(dbCodeBoard[j][k] == arr[i][0]) {
                    x1 = j;
                    y1 = k;
                }
                if(dbCodeBoard[j][k] == arr[i][1]) {
                    x2 = j;
                    y2 = k;
                }
            }
        }
        
        if(x1==x2) { //행이 같은경우
            tmp[0] = dbCodeBoard[x1][(y1+1)%5];
            tmp[1] = dbCodeBoard[x2][(y2+1)%5];
        } else if(y1==y2) { //열이 같은 경우
            tmp[0] = dbCodeBoard[(x1+1)%5][y1];
            tmp[1] = dbCodeBoard[(x2+1)%5][y2];
        } else { //행, 열 모두 다른경우
            tmp[0] = dbCodeBoard[x2][y1];
            tmp[1] = dbCodeBoard[x1][y2];
        }

        encArr.push(tmp);
    }
    
    for(var i=0; i<encArr.length; i++) {
        encResult += encArr[i][0]+encArr[i][1]+" ";
    }

    return encResult;
}

function DoubleDecryption(key, enStr) {
    var arr = []; //암호화된 쌍자암호
    var decArr = []; //복호화된 쌍자암호
    var x1=0 , x2=0 , y1=0, y2=0; //쌍자 암호 두 글자의 각각의 행,열 값
    var decResult = "";
    
    for(var i=0; i<enStr.length; i++) {
        var twoWord = [];
        twoWord[0] = enStr.charAt(i);
        twoWord[1] = enStr.charAt(++i);
        arr.push(twoWord);
    }

    for(var i=0; i<arr.length; i++) {
    var tmp = [];

        for(var j=0; j<dbCodeBoard.length; j++) {
            for(var k=0 ; k<dbCodeBoard[j].length; k++)  {
                if(dbCodeBoard[j][k] == arr[i][0]) {
                    x1 = j;
                    y1 = k;
                }
                if(dbCodeBoard[j][k] == arr[i][1]) {
                    x2 = j;
                    y2 = k;
                }
            }
        }
        
        if(x1==x2) { //행이 같은 경우
            tmp[0] = dbCodeBoard[x1][(y1+4)%5];
            tmp[1] = dbCodeBoard[x2][(y2+4)%5];
        } else if(y1==y2) { //열이 같은 경우
            tmp[0] = dbCodeBoard[(x1+4)%5][y1];
            tmp[1] = dbCodeBoard[(x2+4)%5][y2];
        } else { //행, 열 다른경우   
            tmp[0] = dbCodeBoard[x2][y1];
            tmp[1] = dbCodeBoard[x1][y2];
        }
        decArr.push(tmp);
    }
    
    for(var i=0; i<decArr.length; i++) { //중복 문자열 돌려놓음
        if(i != decArr.length-1 && decArr[i][1]=='x' && decArr[i][0]==decArr[i+1][0]) {	
            decResult += decArr[i][0];
        } else if(i == decArr.length-1 && decArr[i][1]=='x') {
            decResult += decArr[i][0];
        } else {
            decResult += decArr[i][0]+decArr[i][1];
        }
    }
    for(var i=0; i<zCheck.length; i++) {
        for(var j=0; j<decResult.length; j++) {
            if(zCheck[i] == j) {
                decResult = decResult.substring(0, j) + "z" + decResult.substring(j+1, decResult.length);
            }
        }
    }

    return decResult;
}


/*
==========================================
단일치환
==========================================
*/
function makeSingleBoard(alpa) {
    var keyCount = 0;
    var chk = false;
    keyResult = "";

    var alpabet = "abcdefghijklmnopqrstuvwxyz";

    for(var i=0; i<alpabet.length; i++) {
        if(alpa.charAt(alpa.length-1) == alpabet.charAt(i)) {
            alpa += alpabet.substring(i+1, alpabet.length);
            break;
        }
    }

    for(var i=0; i<alpa.length; i++) {
		for(var j=0; j<keyResult.length; j++) {
			if(alpa.charAt(i)==keyResult.charAt(j)) {
				chk = true;
				break;
			}
		}
		if(!(chk)) keyResult += alpa.charAt(i);
		chk = false;
    }

    for(var i=0; i<alpabet.length; i++) {
        for(var j=0; j<keyResult.length; j++) {
            if(alpabet.charAt(i) == keyResult.charAt(j)) {
                chk = true;
                break;
            }
        }
        if(!chk) keyResult += alpabet.charAt(i);
        chk = false;
    }

    for(var i=0; i<alpabet.length; i++) {
            singCodeBoard[i] = keyResult.charAt(keyCount++);
            document.getElementById(keyCount).innerHTML = singCodeBoard[i];
    }
    
    return false;
}

function SingleEncryption(key, sentence) {
    var alpabet = "abcdefghijklmnopqrstuvwxyz";
    var encStr = "";

    for(var i=0; i<sentence.length; i++) {
        for(var j=0; j<alpabet.length; j++) {
            if(sentence.charAt(i) == alpabet.charAt(j)) {
                encStr += keyResult.charAt(j);
                break;
            }
        }
    }

    for(var i=0; i<blankCheck.length; i++) {
        for(var j=0; j<encStr.length; j++) {
            if(blankCheck[i] == j) {
                encStr = encStr.substring(0, j) + " " + encStr.substring(j, encStr.length);
                blankCheck[i+1] += i+1;
            }
        }
    }

    return encStr;
}

function SingleDecryption(key, encStr) {
    var alpabet = "abcdefghijklmnopqrstuvwxyz";
    var decResult = "";
    var decPlayFair = [];

    for(var i=0; i<encStr.length; i++) {
        for(var j=0; j<alpabet.length; j++) {
            if(encStr.charAt(i) == keyResult.charAt(j)) {
                decResult += alpabet.charAt(j);
                break;
            }
        }
    }
    
    for(var i=0; i<decPlayFair.length; i++) {
        if(i != decPlayFair.length-1 && decPlayFair[i][1]=='x' && decPlayFair[i][0]==decPlayFair[i+1][0]) {	
            decResult += decPlayFair[i][0];
        } else {
            decResult += decPlayFair[i][0]+""+decPlayFair[i][1];
        }
    }

    for(var i=0; i<zCheck.length; i++) {
        for(var j=0; j<decResult.length; j++) {
            if(zCheck[i] == j) {
                decResult = decResult.substring(0, j) + "z" + decResult.substring(j+1, decResult.length);
            }
        }
    }
    
    return decResult;
}