// import css
// import js component for each category

const topics = (props) => {
    return (
        <div>
            <h1>Categories</h1>
            {props.entries.map( (entry) => (
                <a>{entry}</a>
            ))}
        </div>
    )
}

const defaultEndPoint = `http://localhost:5000/categories`;
export const getServerSideProps = async() => {
  const res = await fetch (defaultEndPoint)
  const entries = await res.json()
  return {
    props: {
      entries
    }
  }
}

export default topics
