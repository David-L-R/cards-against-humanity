import style from "../styles/cardTemplate.module.css";

const CardTemplate = (props) => {
  const { id } = props;

  const addClassName = () => {
    const { pick, pack } = props.card;

    console.log("condition", 0 === 0);

    if (pick) {
      return `${style.cardTemplateContainer} ${style.black}`;
    } else if (pack >= 0 && pack !== undefined) {
      return `${style.cardTemplateContainer}`;
    }
    return `${style.cardTemplateContainer} ${style.skeleton}`;
  };

  return <div className={addClassName()}>{id}</div>;
};

export default CardTemplate;
