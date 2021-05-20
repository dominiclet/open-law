import caseStyle from '../styles/Case.module.css'

const TextBox = () => {
    const handleClick = (element) => {
        var content = element.target.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        };
    }
    
    return (
        <div className={caseStyle.facts}>
            <div className={caseStyle.collapsible} onClick={handleClick}>
                Fact / Holding / Obiter etc 
            </div>
            <div className={caseStyle.collapsiblecontent}>
                <p>
                    Content content content...
                </p>
            </div>
        </div>
    )
}

export default TextBox
