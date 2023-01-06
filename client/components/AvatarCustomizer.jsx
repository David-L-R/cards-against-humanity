import React from "react";

export const AvatarCustomizer = () => {
  return (
    <>
      <div>AvatarCustomizer</div>
      <br />
      <form>
        <label for="mode">Mode:</label>
        <br />
        <select id="mode" name="mode">
          <option value="include">Include</option>
          <option value="exclude">Exclude</option>
        </select>
        <br />
        <label for="top">Top:</label>
        <br />
        <select id="top" name="top">
          <option value="longHair">Long Hair</option>
          <option value="shortHair">Short Hair</option>
          <option value="eyepatch">Eyepatch</option>
          <option value="hat">Hat</option>
          <option value="hijab">Hijab</option>
          <option value="turban">Turban</option>
          <option value="bigHair">Big Hair</option>
          <option value="bob">Bob</option>
          <option value="bun">Bun</option>
          <option value="curly">Curly</option>
          <option value="curvy">Curvy</option>
          <option value="dreads">Dreads</option>
          <option value="frida">Frida</option>
          <option value="fro">Fro</option>
          <option value="froAndBand">Fro And Band</option>
          <option value="miaWallace">Mia Wallace</option>
          <option value="longButNotTooLong">Long But Not Too Long</option>
          <option value="shavedSides">Shaved Sides</option>
          <option value="straight01">Straight 01</option>
          <option value="straight02">Straight 02</option>
          <option value="straightAndStrand">Straight And Strand</option>
          <option value="dreads01">Dreads 01</option>
          <option value="dreads02">Dreads 02</option>
          <option value="frizzle">Frizzle</option>
          <option value="shaggy">Shaggy</option>
          <option value="shaggyMullet">Shaggy Mullet</option>
          <option value="shortCurly">Short Curly</option>
          <option value="shortFlat">Short Flat</option>
          <option value="shortRound">Short Round</option>
          <option value="shortWaved">Short Waved</option>
          <option value="sides">Sides</option>
          <option value="theCaesar">The Caesar</option>
          <option value="theCaesarAndSidePart">The Caesar And Side Part</option>
          <option value="winterHat01">Winter Hat 01</option>
          <option value="winterHat02">Winter Hat 02</option>
          <option value="winterHat03">Winter Hat 03</option>
          <option value="winterHat04">Winter Hat 04</option>
        </select>
      </form>
    </>
  );
};
