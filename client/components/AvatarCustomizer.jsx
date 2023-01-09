import React from "react";
const AvatarCustomizer = () => {
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
        <br />
        <label for="topchance"> %chance on hair:</label>
        <br />
        <select id="topChance" name="topChance">
          <option value="0">0</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="60">60</option>
          <option value="70">70</option>
          <option value="80">80</option>
          <option value="90">90</option>
          <option value="100">100</option>
        </select>
        <br />
        <label for="hatColor">Hat Color:</label>
        <br />
        <select id="hatColor" name="hatColor">
          <option value="black">Black</option>
          <option value="blue">Blue</option>
          <option value="blue01">Blue01</option>
          <option value="blue02">Blue02</option>
          <option value="blue03">Blue03</option>
          <option value="gray">gray</option>
          <option value="gray01">gray01</option>
          <option value="gray02">gray02</option>
          <option value="heather">heather</option>
          <option value="pastel">pastel</option>
          <option value="pastelBlue">pastelBlue</option>
          <option value="pastelGreen">pastelGreen</option>
          <option value="pastelOrange">pastelOrange</option>
          <option value="pastelRed">pastelRed</option>
          <option value="pastelYellow">pastelYellow</option>
          <option value="pink">pink</option>
          <option value="red">red</option>
          <option value="white">white</option>
        </select>
        <br />
        <label for="hairColor">Hair Color</label>
        <br />
        <select id="hairColor" name="hairColor">
          <option value="auburn">auburn</option>
          <option value="black">black</option>
          <option value="blonde">blonde</option>
          <option value="blondeGolden">blonde golden</option>
          <option value="brown">brown</option>
          <option value="brownDark">brown dark</option>
          <option value="pastel">pastel</option>
          <option value="pastelPink">pastel pink</option>
          <option value="platinum">platinum</option>
          <option value="red">red</option>
          <option value="gray">gray</option>
          <option value="silverGray">silver gray</option>
        </select>
        <br />
        <label for="accessories">Accessories:</label>
        <br />
        <select id="accessories" name="accessories">
          <option value="kurt">kurt</option>
          <option value="prescription01">prescription 01</option>
          <option value="prescription02">prescription 02</option>
          <option value="round">round</option>
          <option value="sunglasses">sunglasses</option>
          <option value="wayfarers">wayfarers</option>
        </select>
        <br />
        <label for="accessoriesProbability"> % chance on accessory</label>
        <br />
        <select id="accessoriesProbability" name="accessoriesProbability">
          <option value="0">0</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="60">60</option>
          <option value="70">70</option>
          <option value="80">80</option>
          <option value="90">90</option>
          <option value="100">100</option>
        </select>
        <br />
        <label for="accessoriesColor">Accessories Color:</label>
        <br />
        <select id="accessoriesColor" name="accessoriesColor">
          <option value="black">Black</option>
          <option value="blue">Blue</option>
          <option value="blue01">Blue01</option>
          <option value="blue02">Blue02</option>
          <option value="blue03">Blue03</option>
          <option value="gray">gray</option>
          <option value="gray01">gray01</option>
          <option value="gray02">gray02</option>
          <option value="heather">heather</option>
          <option value="pastel">pastel</option>
          <option value="pastelBlue">pastelBlue</option>
          <option value="pastelGreen">pastelGreen</option>
          <option value="pastelOrange">pastelOrange</option>
          <option value="pastelRed">pastelRed</option>
          <option value="pastelYellow">pastelYellow</option>
          <option value="pink">pink</option>
          <option value="red">red</option>
          <option value="white">white</option>
        </select>
        <br />
        <label for="facialHair">Facial hair:</label>
        <br />
        <select id="facialHair" name="facialHair">
          <option value="medium">medium</option>
          <option value="beardMedium">beard medium</option>
          <option value="light">light</option>
          <option value="beardLight">beard light</option>
          <option value="majestic">majestic</option>
          <option value="beardMajestic">beard majestic</option>
          <option value="fancy">fancy</option>
          <option value="moustacheFancy">moustache fancy</option>
          <option value="magnum">magnum</option>
          <option value="moustacheMagnum">moustache magnum</option>
        </select>
        <br />
        <label for="facialHairProbability">Facial hair chance</label>
        <br />
        <select id="facialHairProbability" name="facialHairProbability">
          <option value="0">0</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="60">60</option>
          <option value="70">70</option>
          <option value="80">80</option>
          <option value="90">90</option>
          <option value="100">100</option>
        </select>
        <br />
        <label for="facialHairColor">Facial hair color:</label>
        <br />
        <select id="facialHairColor" name="facialHairColor">
          <option value="auburn">auburn</option>
          <option value="black">black</option>
          <option value="blonde">blonde</option>
          <option value="blondeGolden">blonde golden</option>
          <option value="brown">brown</option>
          <option value="brownDark">brown dark</option>
          <option value="pastel">pastel</option>
          <option value="pastelPink">pastel pink</option>
          <option value="platinum">platinum</option>
          <option value="red">red</option>
          <option value="gray">gray</option>
          <option value="silverGray">silver gray</option>
        </select>
        <br />
        <label for="clothes">Clothes:</label>
        <br />
        <select id="clothes" name="clothes">
          <option value="blazer">blazer</option>
          <option value="blazerAndShirt">blazer and shirt</option>
          <option value="blazerAndSweater">blazer and sweater</option>
          <option value="sweater">sweater</option>
          <option value="collarAndSweater">collar and sweater</option>
          <option value="shirt">shirt</option>
          <option value="graphicShirt">graphic shirt</option>
          <option value="shirtCrewNeck">shirt crew neck</option>
          <option value="shirtScoopNeck">shirt scoop neck</option>
          <option value="shirtVNeck">shirt V neck</option>
          <option value="hoodie">hoodie</option>
          <option value="overall">overall</option>
        </select>
        <br />
        <label for="clothesColor">Clothes color:</label>
        <br />
        <select id="clothesColor" name="clothesColor">
          <option value="black">black</option>
          <option value="blue">blue</option>
          <option value="blue01">blue 01</option>
          <option value="blue02">blue 02</option>
          <option value="blue03">blue 03</option>
          <option value="gray">gray</option>
          <option value="gray01">gray 01</option>
          <option value="gray02">gray 02</option>
          <option value="heather">heather</option>
          <option value="pastel">pastel</option>
          <option value="pastelBlue">pastel blue</option>
          <option value="pastelGreen">pastel green</option>
          <option value="pastelOrange">pastel orange</option>
          <option value="pastelRed">pastel red</option>
          <option value="pastelYellow">pastel yellow</option>
          <option value="pink">pink</option>
          <option value="red">red</option>
          <option value="white">white</option>
        </select>
        <br />
        <label for="eyes">Eyes:</label>
        <br />
        <select id="eyes" name="eyes">
          <option value="close">close</option>
          <option value="closed">closed</option>
          <option value="cry">cry</option>
          <option value="default">default</option>
          <option value="dizzy">dizzy</option>
          <option value="xDizzy">x dizzy</option>
          <option value="roll">roll</option>
          <option value="eyeRoll">eye roll</option>
          <option value="happy">happy</option>
          <option value="hearts">hearts</option>
          <option value="side">side</option>
          <option value="squint">squint</option>
          <option value="surprised">surprised</option>
          <option value="wink">wink</option>
          <option value="winkWacky">wink wacky</option>
        </select>
        <br />
        <label for="eyebrow">Eyebrow:</label>
        <br />
        <select id="eyebrow" name="eyebrow">
          <option value="angry">angry</option>
          <option value="angryNatural">angry natural</option>
          <option value="default">default</option>
          <option value="defaultNatural">default natural</option>
          <option value="flat">flat</option>
          <option value="flatNatural">flat natural</option>
          <option value="raised">raised</option>
          <option value="raisedExcited">raised excited</option>
          <option value="raisedExcitedNatural">raised excited natural</option>
          <option value="sad">sad</option>
          <option value="sadConcerned">sad concerned</option>
          <option value="sadConcernedNatural">sad concerned natural</option>
          <option value="unibrow">unibrow</option>
          <option value="unibrowNatural">unibrow natural</option>
          <option value="up">up</option>
          <option value="upDown">up down</option>
          <option value="upDownNatural">up down natural</option>
          <option value="frown">frown</option>
          <option value="frownNatural">frown natural</option>
        </select>
        <br />
        <label for="mouth">Mouth:</label>
        <br />
        <select id="mouth" name="mouth">
          <option value="concerned">concerned</option>
          <option value="default">default</option>
          <option value="disbelief">disbelief</option>
          <option value="eating">eating</option>
          <option value="grimace">grimace</option>
          <option value="sad">sad</option>
          <option value="scream">scream</option>
          <option value="screamOpen">scream open</option>
          <option value="serious">serious</option>
          <option value="smile">smile</option>
          <option value="tongue">tongue</option>
          <option value="twinkle">twinkle</option>
          <option value="vomit">vomit</option>
        </select>
        <br />
        <label for="skin">Skin:</label>
        <br />
        <select id="skin" name="skin">
          <option value="tanned">tanned</option>
          <option value="yellow">yellow</option>
          <option value="pale">pale</option>
          <option value="light">light</option>
          <option value="brown">brown</option>
          <option value="darkBrown">dark brown</option>
          <option value="black">black</option>
        </select>
        <br />
        <label for="clothesGraphics">Clothing graphics:</label>
        <br />
        <select id="clothesGraphics" name="clothesGraphics">
          <option value="skullOutline">skull outline</option>
          <option value="skull">skull</option>
          <option value="resist">resist</option>
          <option value="pizza">pizza</option>
          <option value="hola">hola</option>
          <option value="diamond">diamond</option>
          <option value="deer">deer</option>
          <option value="cumbia">cumbia</option>
          <option value="bear">bear</option>
          <option value="bat">bat</option>
        </select>
        <br />
      </form>
    </>
  );
};
export default AvatarCustomizer;
