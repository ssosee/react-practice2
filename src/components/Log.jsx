export default function Log({turns}) {
    return (
        <ol id="log">
            {turns.map((turn) => {
                let square = turn.square;
                return <li key={`${square.row}${square.col}`}>
                    {turn.player} selected ({square.row}, {square.col})
                </li>
            })}
        </ol>
    )
}