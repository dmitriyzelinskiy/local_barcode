
class LocBar {
  constructor (settings) {
    this.settings = {
      barWidth:      settings.barWidth     !== undefined ? settings.barWidth     :  1,
      barHeight:     settings.barHeight    !== undefined ? settings.barHeight    :  50,
      moduleSize:    settings.moduleSize   !== undefined ? settings.moduleSize   :  5,
      showHRI:       settings.showHRI      !== undefined ? settings.showHRI      :  false,
      addQuietZone:  settings.addQuietZone !== undefined ? settings.addQuietZone :  true,
      marginHRI:     settings.marginHRI    !== undefined ? settings.marginHRI    :  5,
      bgColor:       settings.bgColor      !== undefined ? settings.bgColor      :  "#FFFFFF",
      color:         settings.color        !== undefined ? settings.color        :  "#000000",
      fontSize:      settings.fontSize     !== undefined ? settings.fontSize     :  12,
      fontFamily:    settings.fontFamily   !== undefined ? settings.fontFamily   :  "Arial",
      output:        settings.output       !== undefined ? settings.output       :  "svg",
      posX:          settings.posX         !== undefined ? settings.posX         :  0,
      posY:          settings.posY         !== undefined ? settings.posY         :  0,
    }
  }









// * * * * * * * * * * * * * * * * * * * * * *
// code 39
// * * * * * * * * * * * * * * * * * * * * * *

#encodingCode39 = ["101001101101", "110100101011", "101100101011", "110110010101",
  "101001101011", "110100110101", "101100110101", "101001011011",
  "110100101101", "101100101101", "110101001011", "101101001011",
  "110110100101", "101011001011", "110101100101", "101101100101",
  "101010011011", "110101001101", "101101001101", "101011001101",
  "110101010011", "101101010011", "110110101001", "101011010011",
  "110101101001", "101101101001", "101010110011", "110101011001",
  "101101011001", "101011011001", "110010101011", "100110101011",
  "110011010101", "100101101011", "110010110101", "100110110101",
  "100101011011", "110010101101", "100110101101", "100100100101",
  "100100101001", "100101001001", "101001001001", "100101101101"];

#getDigitCode39(code) {
  let i, index,
    result = "",
    table = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*",
    intercharacter = "0";

  if (code.indexOf("*") >= 0) {
    return "";
  }

  // Add Start and Stop charactere : *
  code = ("*" + code + "*").toUpperCase();

  for (i = 0; i < code.length; i++) {
    index = table.indexOf(code.charAt(i));
    if (index < 0) {
      return "";
    }
    if (i > 0) {
      result += intercharacter;
    }
    result += this.#encodingCode39[index];
  }
  return result;
}












// * * * * * * * * * * * * * * * * * * * * * *
// code 128
// * * * * * * * * * * * * * * * * * * * * * *

#encodingCode128 = ["11011001100", "11001101100", "11001100110", "10010011000", "10010001100", "10001001100", "10011001000", "10011000100", "10001100100", "11001001000", "11001000100", "11000100100", "10110011100", "10011011100", "10011001110", "10111001100", "10011101100", "10011100110", "11001110010", "11001011100", "11001001110", "11011100100", "11001110100", "11101101110", "11101001100", "11100101100", "11100100110", "11101100100", "11100110100", "11100110010", "11011011000", "11011000110", "11000110110", "10100011000", "10001011000", "10001000110", "10110001000", "10001101000", "10001100010", "11010001000", "11000101000", "11000100010", "10110111000", "10110001110", "10001101110", "10111011000", "10111000110", "10001110110", "11101110110", "11010001110", "11000101110", "11011101000", "11011100010", "11011101110", "11101011000", "11101000110", "11100010110", "11101101000", "11101100010", "11100011010", "11101111010", "11001000010", "11110001010", "10100110000", "10100001100", "10010110000", "10010000110", "10000101100", "10000100110", "10110010000", "10110000100", "10011010000", "10011000010", "10000110100", "10000110010", "11000010010", "11001010000", "11110111010", "11000010100", "10001111010", "10100111100", "10010111100", "10010011110", "10111100100", "10011110100", "10011110010", "11110100100", "11110010100", "11110010010", "11011011110", "11011110110", "11110110110", "10101111000", "10100011110", "10001011110", "10111101000", "10111100010", "11110101000", "11110100010", "10111011110", "10111101110", "11101011110", "11110101110", "11010000100", "11010010000", "11010011100", "11000111010"];

#getDigitCode128(code) {
    let i, c, tableCActivated, result, sum,
      tableB = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
      isum = 0,
      j = 0,
      value = 0;

    // check each characters
    for (i = 0; i < code.length; i++) {
      if (tableB.indexOf(code.charAt(i)) === -1) {
        return "";
      }
    }

    // check firsts characters : start with C table only if enough numeric
    tableCActivated = code.length > 1;
    for (i = 0; i < 3 && i < code.length; i++) {
      c = code.charAt(i);
      tableCActivated = tableCActivated && c >= '0' && c <= '9';
    }


    sum = tableCActivated ? 105 : 104;

    // start : [105] : C table or [104] : B table
    result = this.#encodingCode128[sum];

    i = 0;
    while (i < code.length) {
      if (!tableCActivated) {
        j = 0;
        // check next character to activate C table if interresting
        while ((i + j < code.length) && (code.charAt(i + j) >= '0') && (code.charAt(i + j) <= '9')) {
          j++;
        }

        // 6 min everywhere or 4 mini at the end
        tableCActivated = (j > 5) || ((i + j - 1 === code.length) && (j > 3));

        if (tableCActivated) {
          result += this.#encodingCode128[99]; // C table
          sum += ++isum * 99;
        }
        //         2 min for table C so need table B
      } else if ((i === code.length) || (code.charAt(i) < '0') || (code.charAt(i) > '9') || (code.charAt(i + 1) < '0') || (code.charAt(i + 1) > '9')) {
        tableCActivated = false;
        result += this.#encodingCode128[100]; // B table
        sum += ++isum * 100;
      }

      if (tableCActivated) {
        value = this.#intval(code.charAt(i) + code.charAt(i + 1)); // Add two characters (numeric)
        i += 2;
      } else {
        value = tableB.indexOf(code.charAt(i)); // Add one character
        i += 1;
      }
      result  += this.#encodingCode128[value];
      sum += ++isum * value;
    }

    // Add CRC
    result  += this.#encodingCode128[sum % 103];

    // Stop
    result += this.#encodingCode128[106];

    // Termination bar
    result += "11";

    return result;
  }






















// * * * * * * * * * * * * * * * * * * * * * *
// datamatrix
// * * * * * * * * * * * * * * * * * * * * * *

#getDigitDatamatrix(text, rectangular) {
  let lengthRows = [ 10, 12, 14, 16, 18, 20, 22, 24, 26, 32, 36, 40, 44, 48, 52, 64, 72, 80,  88, 96, 104, 120, 132, 144, 8, 8, 12, 12, 16, 16],
    lengthCols = [ 10, 12, 14, 16, 18, 20, 22, 24, 26, 32, 36, 40, 44, 48, 52, 64, 72, 80, 88, 96, 104, 120, 132, 144, 18, 32, 26, 36, 36, 48],
    dataCWCount = [ 3, 5, 8, 12,  18,  22,  30,  36, 44, 62, 86, 114, 144, 174, 204, 280, 368, 456, 576, 696, 816, 1050, 1304, 1558, 5, 10, 16, 22, 32, 49],
    solomonCWCount = [ 5, 7, 10, 12, 14, 18, 20, 24, 28, 36, 42, 48, 56, 68, 84, 112, 144, 192, 224, 272, 336, 408, 496, 620, 7, 11, 14, 18, 24, 28],
    dataRegionRows = [ 8, 10, 12, 14, 16, 18, 20, 22, 24, 14, 16, 18, 20, 22, 24, 14, 16, 18, 20, 22, 24, 18, 20, 22, 6,  6, 10, 10, 14, 14],
    dataRegionCols = [ 8, 10, 12, 14, 16, 18, 20, 22, 24, 14, 16, 18, 20, 22, 24, 14, 16, 18, 20, 22, 24, 18, 20, 22, 16, 14, 24, 16, 16, 22],
    regionRows = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 6, 6, 6, 1, 1, 1, 1, 1, 1],
    regionCols = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 6, 6, 6, 1, 2, 1, 2, 2, 2],
    interleavedBlocks = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 4, 4, 4, 4, 6, 6, 8, 8, 1, 1, 1, 1, 1, 1],
    logTab = [ -255, 255, 1, 240, 2, 225, 241, 53, 3,38, 226, 133, 242, 43, 54, 210, 4, 195, 39, 114, 227, 106, 134, 28, 243, 140, 44, 23, 55, 118, 211, 234, 5, 219, 196, 96, 40, 222, 115, 103, 228, 78, 107, 125, 135, 8, 29, 162, 244, 186, 141, 180, 45, 99, 24, 49, 56, 13, 119, 153, 212, 199, 235, 91, 6, 76, 220, 217, 197,11, 97, 184, 41, 36, 223, 253, 116, 138, 104, 193, 229, 86, 79, 171, 108, 165, 126, 145, 136, 34, 9, 74, 30, 32, 163, 84, 245, 173, 187, 204, 142, 81, 181, 190, 46, 88, 100, 159, 25, 231, 50, 207, 57, 147, 14, 67, 120, 128, 154, 248, 213, 167, 200, 63, 236, 110, 92, 176, 7, 161, 77, 124, 221, 102, 218, 95, 198, 90, 12, 152, 98, 48, 185, 179, 42, 209, 37, 132, 224, 52, 254, 239, 117, 233, 139, 22, 105, 27, 194, 113, 230, 206, 87, 158, 80, 189, 172, 203, 109, 175, 166, 62, 127, 247, 146, 66, 137, 192, 35, 252, 10, 183, 75, 216, 31, 83, 33, 73, 164, 144, 85, 170, 246, 65, 174, 61, 188, 202, 205, 157, 143, 169, 82, 72, 182, 215, 191, 251, 47, 178, 89, 151, 101, 94, 160, 123, 26, 112,232, 21, 51, 238, 208, 131, 58, 69, 148, 18, 15, 16, 68, 17, 121, 149, 129, 19, 155, 59, 249, 70, 214, 250, 168, 71, 201, 156, 64, 60, 237, 130, 111, 20, 93, 122, 177, 150],
    aLogTab = [ 1, 2, 4, 8, 16, 32, 64, 128, 45, 90, 180, 69, 138, 57, 114, 228, 229, 231, 227, 235, 251, 219, 155, 27, 54, 108, 216, 157, 23, 46, 92, 184, 93, 186, 89, 178, 73, 146, 9, 18, 36, 72, 144, 13, 26, 52, 104, 208, 141, 55, 110, 220, 149, 7, 14, 28, 56, 112, 224, 237, 247, 195, 171, 123, 246, 193, 175, 115, 230, 225, 239, 243, 203, 187, 91, 182, 65, 130, 41, 82, 164, 101, 202, 185, 95, 190, 81, 162, 105, 210, 137, 63, 126, 252, 213, 135, 35, 70, 140, 53, 106, 212, 133, 39, 78, 156, 21, 42, 84, 168, 125, 250, 217, 159, 19, 38, 76, 152, 29, 58, 116, 232, 253, 215, 131, 43, 86, 172, 117, 234, 249, 223, 147, 11, 22, 44, 88, 176, 77, 154, 25, 50, 100, 200, 189, 87, 174, 113, 226, 233, 255, 211, 139, 59, 118, 236, 245, 199, 163, 107, 214, 129, 47, 94, 188, 85, 170, 121, 242, 201, 191, 83, 166, 97, 194, 169, 127, 254, 209, 143, 51, 102, 204, 181, 71, 142, 49, 98, 196, 165, 103, 206, 177, 79, 158, 17, 34, 68, 136, 61, 122, 244, 197, 167, 99, 198, 161, 111, 222, 145, 15, 30, 60, 120, 240, 205, 183, 67, 134, 33, 66, 132,37, 74, 148, 5, 10, 20, 40, 80, 160, 109, 218, 153, 31, 62, 124, 248, 221, 151, 3, 6, 12, 24, 48, 96, 192, 173, 119, 238, 241, 207, 179, 75, 150, 1];

  function champGaloisMult(a, b) {  // MULTIPLICATION IN GALOIS FIELD GF(2^8)
    if (!a || !b) {
      return 0;
    }
    return aLogTab[(logTab[a] + logTab[b]) % 255];
  }

  function champGaloisDoub(a, b) {  // THE OPERATION a * 2^b IN GALOIS FIELD GF(2^8)
    if (!a) {
      return 0;
    }
    if (!b) {
      return a;
    }
    return aLogTab[(logTab[a] + b) % 255];
  }

  function champGaloisSum(a, b) { // SUM IN GALOIS FIELD GF(2^8)
    return a ^ b;
  }

  function selectIndex(dataCodeWordsCount, rectangular) { // CHOOSE THE GOOD INDEX FOR TABLES
    var n = 0;
    if ((dataCodeWordsCount < 1 || dataCodeWordsCount > 1558) && !rectangular) {
      return -1;
    }
    if ((dataCodeWordsCount < 1 || dataCodeWordsCount > 49) && rectangular) {
      return -1;
    }
    if (rectangular) {
      n = 24;
    }

    while (dataCWCount[n] < dataCodeWordsCount) {
      n++;
    }
    return n;
  }

  function encodeDataCodeWordsASCII(text) {
    var i, c,
      dataCodeWords = [],
      n = 0;
    for (i = 0; i < text.length; i++) {
      c = text.charCodeAt(i);
      if (c > 127) {
        dataCodeWords[n] = 235;
        c = c - 127;
        n++;
      } else if ((c >= 48 && c <= 57) && (i + 1 < text.length) && (text.charCodeAt(i + 1) >= 48 && text.charCodeAt(i + 1) <= 57)) {
        c = ((c - 48) * 10) + ((text.charCodeAt(i + 1)) - 48);
        c += 130;
        i++;
      } else {
        c++;
      }
      dataCodeWords[n] = c;
      n++;
    }
    return dataCodeWords;
  }

  function addPadCW(tab, from, to) {
    var r, i;
    if (from >= to) {
      return;
    }
    tab[from] = 129;
    for (i = from + 1; i < to; i++) {
      r = ((149 * (i + 1)) % 253) + 1;
      tab[i] = (129 + r) % 254;
    }
  }

  function calculSolFactorTable(aSolomonCWCount) { // CALCULATE THE REED SOLOMON FACTORS
    var i, j,
      g = [];

    for (i = 0; i <= aSolomonCWCount; i++) {
      g[i] = 1;
    }

    for (i = 1; i <= aSolomonCWCount; i++) {
      for (j = i - 1; j >= 0; j--) {
        g[j] = champGaloisDoub(g[j], i);
        if (j > 0) {
          g[j] = champGaloisSum(g[j], g[j - 1]);
        }
      }
    }
    return g;
  }

  function addReedSolomonCW(nSolomonCW, coeffTab, nDataCW, dataTab, blocks) { // Add the Reed Solomon codewords
    var i, j, k,
      temp = 0,
      errorBlocks = nSolomonCW / blocks,
      correctionCW = [];
    for (k = 0; k < blocks; k++) {
      for (i = 0; i < errorBlocks; i++) {
        correctionCW[i] = 0;
      }

      for (i = k; i < nDataCW; i += blocks) {
        temp = champGaloisSum(dataTab[i], correctionCW[errorBlocks - 1]);
        for (j = errorBlocks - 1; j >= 0; j--) {

          correctionCW[j] = temp ? champGaloisMult(temp, coeffTab[j]) : 0;
          if (j > 0) {
            correctionCW[j] = champGaloisSum(correctionCW[j - 1], correctionCW[j]);
          }
        }
      }
      // Renversement des blocs calcules
      j = nDataCW + k;
      for (i = errorBlocks - 1; i >= 0; i--) {
        dataTab[j] = correctionCW[i];
        j += blocks;
      }
    }
    return dataTab;
  }

  function getBits(entier) { // Transform integer to tab of bits
    var i,
      bits = [];
    for (i = 0; i < 8; i++) {
      bits[i] = entier & (128 >> i) ? 1 : 0;
    }
    return bits;
  }

  function next(etape, totalRows, totalCols, codeWordsBits, datamatrix, assigned) { // Place codewords into the matrix
    var chr = 0, // Place of the 8st bit from the first character to [4][0]
      row = 4,
      col = 0;

    do {
      // Check for a special case of corner
      if ((row === totalRows) && !col) {
        patternShapeSpecial1(datamatrix, assigned, codeWordsBits[chr], totalRows, totalCols);
        chr++;
      } else if ((etape < 3) && (row === totalRows - 2) && !col && (totalCols % 4)) {
        patternShapeSpecial2(datamatrix, assigned, codeWordsBits[chr], totalRows, totalCols);
        chr++;
      } else if ((row === totalRows - 2) && !col && (totalCols % 8 === 4)) {
        patternShapeSpecial3(datamatrix, assigned, codeWordsBits[chr], totalRows, totalCols);
        chr++;
      } else if ((row === totalRows + 4) && (col === 2) && (totalCols % 8 === 0)) {
        patternShapeSpecial4(datamatrix, assigned, codeWordsBits[chr], totalRows, totalCols);
        chr++;
      }

      // Go up and right in the datamatrix
      do {
        if ((row < totalRows) && (col >= 0) && (assigned[row][col] !== 1)) {
          patternShapeStandard(datamatrix, assigned, codeWordsBits[chr], row, col, totalRows, totalCols);
          chr++;
        }
        row -= 2;
        col += 2;
      } while ((row >= 0) && (col < totalCols));
      row += 1;
      col += 3;

      // Go down and left in the datamatrix
      do {
        if ((row >= 0) && (col < totalCols) && (assigned[row][col] !== 1)) {
          patternShapeStandard(datamatrix, assigned, codeWordsBits[chr], row, col, totalRows, totalCols);
          chr++;
        }
        row += 2;
        col -= 2;
      } while ((row < totalRows) && (col >= 0));
      row += 3;
      col += 1;
    } while ((row < totalRows) || (col < totalCols));
  }

  function patternShapeStandard(datamatrix, assigned, bits, row, col, totalRows, totalCols) { // Place bits in the matrix (standard or special case)
    var f = placeBitInDatamatrix;
    f(datamatrix, assigned, bits[0], row - 2, col - 2, totalRows, totalCols);
    f(datamatrix, assigned, bits[1], row - 2, col - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[2], row - 1, col - 2, totalRows, totalCols);
    f(datamatrix, assigned, bits[3], row - 1, col - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[4], row - 1, col, totalRows, totalCols);
    f(datamatrix, assigned, bits[5], row, col - 2, totalRows, totalCols);
    f(datamatrix, assigned, bits[6], row, col - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[7], row,  col, totalRows, totalCols);
  }

  function patternShapeSpecial1(datamatrix, assigned, bits, totalRows, totalCols) {
    var f = placeBitInDatamatrix;
    f(datamatrix, assigned, bits[0], totalRows - 1,  0, totalRows, totalCols);
    f(datamatrix, assigned, bits[1], totalRows - 1,  1, totalRows, totalCols);
    f(datamatrix, assigned, bits[2], totalRows - 1,  2, totalRows, totalCols);
    f(datamatrix, assigned, bits[3], 0, totalCols - 2, totalRows, totalCols);
    f(datamatrix, assigned, bits[4], 0, totalCols - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[5], 1, totalCols - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[6], 2, totalCols - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[7], 3, totalCols - 1, totalRows, totalCols);
  }

  function patternShapeSpecial2(datamatrix, assigned, bits, totalRows, totalCols) {
    var f = placeBitInDatamatrix;
    f(datamatrix, assigned, bits[0], totalRows - 3,  0, totalRows, totalCols);
    f(datamatrix, assigned, bits[1], totalRows - 2,  0, totalRows, totalCols);
    f(datamatrix, assigned, bits[2], totalRows - 1,  0, totalRows, totalCols);
    f(datamatrix, assigned, bits[3], 0, totalCols - 4, totalRows, totalCols);
    f(datamatrix, assigned, bits[4], 0, totalCols - 3, totalRows, totalCols);
    f(datamatrix, assigned, bits[5], 0, totalCols - 2, totalRows, totalCols);
    f(datamatrix, assigned, bits[6], 0, totalCols - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[7], 1, totalCols - 1, totalRows, totalCols);
  }

  function patternShapeSpecial3(datamatrix, assigned, bits, totalRows, totalCols) {
    var f = placeBitInDatamatrix;
    f(datamatrix, assigned, bits[0], totalRows - 3,  0, totalRows, totalCols);
    f(datamatrix, assigned, bits[1], totalRows - 2,  0, totalRows, totalCols);
    f(datamatrix, assigned, bits[2], totalRows - 1,  0, totalRows, totalCols);
    f(datamatrix, assigned, bits[3], 0, totalCols - 2, totalRows, totalCols);
    f(datamatrix, assigned, bits[4], 0, totalCols - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[5], 1, totalCols - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[6], 2, totalCols - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[7], 3, totalCols - 1, totalRows, totalCols);
  }

  function patternShapeSpecial4(datamatrix, assigned, bits, totalRows, totalCols) {
    var f = placeBitInDatamatrix;
    f(datamatrix, assigned, bits[0], totalRows - 1,  0, totalRows, totalCols);
    f(datamatrix, assigned, bits[1], totalRows - 1, totalCols - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[2], 0, totalCols - 3, totalRows, totalCols);
    f(datamatrix, assigned, bits[3], 0, totalCols - 2, totalRows, totalCols);
    f(datamatrix, assigned, bits[4], 0, totalCols - 1, totalRows, totalCols);
    f(datamatrix, assigned, bits[5], 1, totalCols - 3, totalRows, totalCols);
    f(datamatrix, assigned, bits[6], 1, totalCols - 2, totalRows, totalCols);
    f(datamatrix, assigned, bits[7], 1, totalCols - 1, totalRows, totalCols);
  }

  function placeBitInDatamatrix(datamatrix, assigned, bit, row, col, totalRows, totalCols) { // Put a bit into the matrix
    if (row < 0) {
      row += totalRows;
      col += 4 - ((totalRows + 4) % 8);
    }
    if (col < 0) {
      col += totalCols;
      row += 4 - ((totalCols + 4) % 8);
    }
    if (assigned[row][col] !== 1) {
      datamatrix[row][col] = bit;
      assigned[row][col] = 1;
    }
  }

  function addFinderPattern(datamatrix, rowsRegion, colsRegion, rowsRegionCW, colsRegionCW) { // Add the finder pattern
    var i, j,
      totalRowsCW = (rowsRegionCW + 2) * rowsRegion,
      totalColsCW = (colsRegionCW + 2) * colsRegion,
      datamatrixTemp = [];
    datamatrixTemp[0] = [];
    for (j = 0; j < totalColsCW + 2; j++) {
      datamatrixTemp[0][j] = 0;
    }
    for (i = 0; i < totalRowsCW; i++) {
      datamatrixTemp[i + 1] = [];
      datamatrixTemp[i + 1][0] = 0;
      datamatrixTemp[i + 1][totalColsCW + 1] = 0;
      for (j = 0; j < totalColsCW; j++) {
        if (i % (rowsRegionCW + 2) === 0) {
          if (j % 2) {
            datamatrixTemp[i + 1][j + 1] = 0;
          } else {
            datamatrixTemp[i + 1][j + 1] = 1;
          }
        } else if (i % (rowsRegionCW + 2) === rowsRegionCW + 1) {
          datamatrixTemp[i + 1][j + 1] = 1;
        } else if (j % (colsRegionCW + 2) === colsRegionCW + 1) {
          if (i % 2) {
            datamatrixTemp[i + 1][j + 1] = 1;
          } else {
            datamatrixTemp[i + 1][j + 1] = 0;
          }
        } else if (j % (colsRegionCW + 2) === 0) {
          datamatrixTemp[i + 1][j + 1] = 1;
        } else {
          datamatrixTemp[i + 1][j + 1] = 0;
          datamatrixTemp[i + 1][j + 1] = datamatrix[i - 1 - (2 * (parseInt(i / (rowsRegionCW + 2), 10)))][j - 1 - (2 * (parseInt(j / (colsRegionCW + 2), 10)))];
        }
      }
    }
    datamatrixTemp[totalRowsCW + 1] = [];
    for (j = 0; j < totalColsCW + 2; j++) {
      datamatrixTemp[totalRowsCW + 1][j] = 0;
    }
    return datamatrixTemp;
  }

  function out(text, rectangular) {
    let i, g,
      dataCodeWords = encodeDataCodeWordsASCII(text), // Code the text in the ASCII mode
      aDataCWCount = dataCodeWords.length,
      index = selectIndex(aDataCWCount, rectangular), // Select the index for the data tables
      totalDataCWCount = dataCWCount[index], // Number of data CW
      aSolomonCWCount = solomonCWCount[index], // Number of Reed Solomon CW
      totalCWCount = totalDataCWCount + aSolomonCWCount, // Number of CW
      rowsTotal = lengthRows[index], // Size of symbol
      colsTotal = lengthCols[index],
      rowsRegion = regionRows[index], // Number of region
      colsRegion = regionCols[index],
      rowsRegionCW = dataRegionRows[index],
      colsRegionCW = dataRegionCols[index],
      rowsLengthMatrice = rowsTotal - 2 * rowsRegion, // Size of matrice data
      colsLengthMatrice = colsTotal - 2 * colsRegion,
      blocks = interleavedBlocks[index],  // Number of Reed Solomon blocks
      errorBlocks = (aSolomonCWCount / blocks),
      codeWordsBits = [], // Calculte bits from codewords
      datamatrix = [], // Put data in the matrix
      assigned = [];

    addPadCW(dataCodeWords, aDataCWCount, totalDataCWCount); // Add codewords pads

    g = calculSolFactorTable(errorBlocks); // Calculate correction coefficients

    addReedSolomonCW(aSolomonCWCount, g, totalDataCWCount, dataCodeWords, blocks); // Add Reed Solomon codewords

    for (i = 0; i < totalCWCount; i++) {
      codeWordsBits[i] = getBits(dataCodeWords[i]);
    }

    for (i = 0; i < colsLengthMatrice; i++) {
      datamatrix[i] = [];
      assigned[i] = [];
    }

    // Add the bottom-right corner if needed
    if (((rowsLengthMatrice * colsLengthMatrice) % 8) === 4) {
      datamatrix[rowsLengthMatrice - 2][colsLengthMatrice - 2] = 1;
      datamatrix[rowsLengthMatrice - 1][colsLengthMatrice - 1] = 1;
      datamatrix[rowsLengthMatrice - 1][colsLengthMatrice - 2] = 0;
      datamatrix[rowsLengthMatrice - 2][colsLengthMatrice - 1] = 0;
      assigned[rowsLengthMatrice - 2][colsLengthMatrice - 2] = 1;
      assigned[rowsLengthMatrice - 1][colsLengthMatrice - 1] = 1;
      assigned[rowsLengthMatrice - 1][colsLengthMatrice - 2] = 1;
      assigned[rowsLengthMatrice - 2][colsLengthMatrice - 1] = 1;
    }

    // Put the codewords into the matrix
    console.log('2 dm pre codewords', printMatr(codeWordsBits))
    next(0, rowsLengthMatrice, colsLengthMatrice, codeWordsBits, datamatrix, assigned);

    // Add the finder pattern
    console.log('1 dm pre feinder',datamatrix, printMatr(datamatrix))
    datamatrix = addFinderPattern(datamatrix, rowsRegion, colsRegion, rowsRegionCW, colsRegionCW);
    console.log('0 dm ready',printMatr(datamatrix))
    return datamatrix;
  }

  function printMatr(mat){
    let all=''
    mat.forEach(r=>{
      let row=''
      r.forEach(c=>{
        row+='|'+c
      })
      all+=row+'|\n'
    })
    return all
  }

  return out(text, rectangular)
 }
















  // * * * * * * * * * * * * * * * * * * * * * *
  // tools
  // * * * * * * * * * * * * * * * * * * * * * *

  #intval(val) {
    var type = typeof val;
    if (type === "string") {
      val = val.replace(/[^0-9-.]/g, "");
      val = parseInt(val * 1, 10);
      return isNaN(val) || !isFinite(val) ? 0 : val;
    }
    return type === "number" && isFinite(val) ? Math.floor(val) : 0;
  }

  // convert an int
  #lecCInt(value, byteCount) {
    var i,
      le = "";
    for (i = 0; i < byteCount; i++) {
      le += String.fromCharCode(value & 0xFF);
      value = value >> 8;
    }
    return le;
  }




  // return a byte string from rgb values
  #lecCRgb(r, g, b) {
    return String.fromCharCode(b) + String.fromCharCode(g) + String.fromCharCode(r);
  }


  // return a byte string from a hex string color
  #lecCHexColor(hex) {
    var g, r,
      v = parseInt("0x" + hex.substr(1), 16),
      b = v & 0xFF;
    v = v >> 8;
    g = v & 0xFF;
    r = v >> 8;
    return (this.#lecCRgb(r, g, b));
  }

  // test if a string is a hexa string color (like #FF0000)
  #isHexColor(value) {
    return value.match(/#[0-91-F]/gi);
  }

  // encode data in base64
  #base64Encode(value) {
    var c1, c2, c3, b1, b2, b3, b4,
      r = '',
      k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      i = 0;
    while (i < value.length) {
      c1 = value.charCodeAt(i++);
      c2 = value.charCodeAt(i++);
      c3 = value.charCodeAt(i++);
      b1 = c1 >> 2;
      b2 = ((c1 & 3) << 4) | (c2 >> 4);
      b3 = ((c2 & 15) << 2) | (c3 >> 6);
      b4 = c3 & 63;
      if (isNaN(c2)) {
        b3 = b4 = 64;
      } else if (isNaN(c3)) {
        b4 = 64;
      }
      r += k.charAt(b1) + k.charAt(b2) + k.charAt(b3) + k.charAt(b4);
    }
    return r;
  }

  // convert a bit string to an array of array of bit char
  #bitStringTo2DArray(digit) {
    var i,
      d = [];
    d[0] = [];
    for (i = 0; i < digit.length; i++) {
      d[0][i] = parseInt(digit.charAt(i), 10);
    }
    return d;
  }














  // * * * * * * * * * * * * * * * * * * * * * *
  // Renderer
  // * * * * * * * * * * * * * * * * * * * * * *

  #renderer(output, b2d, settings, digit, hri) {
    let container=document.createElement('div')
    container.innerHTML="output error"
    let w,h
    if (b2d) {
      w = this.#intval(settings.moduleSize)
      h = w
    } else {
      digit = this.#bitStringTo2DArray(digit)
      w = this.#intval(settings.barWidth)
      h = this.#intval(settings.barHeight)
    }

    switch (output) {
      case "bmp":
        return this.#digitToBmpRenderer(settings, digit, hri, w, h)
        break;

      case "svg":
        return this.#digitToSvgRenderer(settings, digit, hri, w, h);
        break;      
    }
    return container
  }



  // svg barcode renderer
  #digitToSvgRenderer(settings, digit, hri, mw, mh) {
    let x, y, fontSize, fontFamily, svg, bar1, len, current, object,
      lines = digit.length,
      columns = digit[0].length,
      width = mw * columns,
      height = mh * lines;

    if (settings.showHRI) {
      fontSize = this.#intval(settings.fontSize);
      fontFamily = this.#intval(settings.fontFamily);
      height += this.#intval(settings.marginHRI) + fontSize;
    }

    // svg header
    svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + width + '" height="' + height + '" shape-rendering="crispEdges">';

    // background
    svg += '<rect width="' +  width + '" height="' + height + '" x="0" y="0" fill="' + settings.bgColor + '" />';

    bar1 = '<rect width="&W" height="' + mh + '" x="&X" y="&Y" fill="' + settings.color + '" />';

    for (y = 0; y < lines; y++) {
      len = 0;
      current = digit[y][0];
      for (x = 0; x < columns; x++) {
        if (current === digit[y][x]) {
          len++;
        } else {
          if (current) {
            svg += bar1.replace("&W", len * mw).replace("&X", (x - len) * mw).replace("&Y", y * mh);
          }
          current = digit[y][x];
          len = 1;
        }
      }
      if (len && current) {
        svg += bar1.replace("&W", len * mw).replace("&X", (columns - len) * mw).replace("&Y", y * mh);
      }
    }

    if (settings.showHRI) {
      svg += '<g transform="translate(' + Math.floor(width / 2) + ' 0)">';
      svg += '<text y="' + (height - Math.floor(fontSize / 2)) + '" text-anchor="middle" style="font-family: '+ fontFamily +' Arial; font-size: ' + fontSize + 'px;" fill="' + settings.color + '">' + hri + '</text>';
      svg += '</g>';
    }
    // svg footer
    svg += '</svg>';

    // create a dom object, flush container and add object to the container

    object = document.createElement('img');
    object.setAttribute('src', 'data:image/svg+xml;base64,'+ this.#base64Encode(svg));
    // container.append(object);

    return object
  }


  // bmp barcode renderer
  #digitToBmpRenderer(settings, digit, hri, mw, mh) {
    var i, y, x, k, padding, dataLen, bmp, line, object,
      lines = digit.length,
      columns = digit[0].length,
      c0 = this.#isHexColor(settings.bgColor) ? this.#lecCHexColor(settings.bgColor) : this.#lecCRgb(255, 255, 255),
      c1 = this.#isHexColor(settings.color) ? this.#lecCHexColor(settings.color) : this.#lecCRgb(0, 0, 0),
      bar0 = "",
      bar1 = "",
      pad = "";

    // create one bar 0 and 1 of "mw" byte length
    for (i = 0; i < mw; i++) {
      bar0 += c0;
      bar1 += c1;
    }

    padding = (4 - ((mw * columns * 3) % 4)) % 4; // Padding for 4 byte alignment ("* 3" come from "3 byte to color R, G and B")
    dataLen = ((mw * columns * 3) + padding) * mh * lines;

    for (i = 0; i < padding; i++) {
      pad += '\0';
    }

    // Bitmap header
    bmp = 'BM' +                        // Magic Number
      this.#lecCInt(54 + dataLen, 4) +  // Size of Bitmap size (header size + data len)
      '\0\0\0\0' +                      // Unused
      this.#lecCInt(54, 4) +            // The offset where the bitmap data (pixels) can be found
      this.#lecCInt(40, 4) +            // The number of bytes in the header (from this point).
      this.#lecCInt(mw * columns, 4) +  // width
      this.#lecCInt(mh * lines, 4) +    // height
      this.#lecCInt(1, 2) +             // Number of color planes being used
      this.#lecCInt(24, 2) +            // The number of bits/pixel
      '\0\0\0\0' +                      // BI_RGB, No compression used
      this.#lecCInt(dataLen, 4) +       // The size of the raw BMP data (after this header)
      this.#lecCInt(2835, 4) +          // The horizontal resolution of the image (pixels/meter)
      this.#lecCInt(2835, 4) +          // The vertical resolution of the image (pixels/meter)
      this.#lecCInt(0, 4) +             // Number of colors in the palette
      this.#lecCInt(0, 4);              // Means all colors are important
    // Bitmap Data
    for (y = lines - 1; y >= 0; y--) {
      line = "";
      for (x = 0; x < columns; x++) {
        line += digit[y][x] ? bar1 : bar0;
      }
      line += pad;
      for (k = 0; k < mh; k++) {
        bmp += line;
      }
    }
    // set bmp image to the container
    object = document.createElement("object");
    object.setAttribute("type", "image/bmp");
    object.setAttribute("data", "data:image/bmp;base64," + this.#base64Encode(bmp));
    let imgs = document.createElement("imgs");
    return object
  }












  bar(value, type, ovSet) {

    this.barValue=value
    this.barType=type    


    if (ovSet!==undefined) {
      for (let i = Object.entries(ovSet).length-1; i>=0; i--) {
        if (this.settings[Object.entries(ovSet)[i][0]]) {
          this.settings[Object.entries(ovSet)[i][0]]=Object.entries(ovSet)[i][1]
        }
      }
    }




    const adiv = document.createElement("div")
    
    let code, crc, rect, fn,
      digit = "",
      hri   = "",
      b2d   = false;

    let data = {crc: true, rect: false, code: this.barValue}

    code  = this.barValue;
    crc   = data.crc;
    rect  = data.rect;

    if (code) {
      if (this.barType===undefined) this.barType='datamatrix'
      switch (this.barType) {
      case "code39":
        digit = this.#getDigitCode39(code);
        hri = code;
        break;
      case "code128":
        digit = this.#getDigitCode128(code);
        hri = code;
        break;
      case "datamatrix":
        digit = this.#getDigitDatamatrix(code, rect);
        hri = code;
        b2d = true;
        break;
      }
      if (digit.length) {
        // Quiet Zone
        if (!b2d && this.settings.addQuietZone) {
          digit = "0000000000" + digit + "0000000000";
        }

        return this.#renderer(this.settings.output, b2d , this.settings, digit, hri)
      }
    }

    return adiv
  }





}   // end class

