export default function WeddingTable(array) {
    const weddingArray = array.props || [];

    const tRows = weddingArray.map((w) => (
        <tr>
            <td>{w.weddingID}</td>
            <td>{w.weddingName}</td>
            <td>{w.weddingDate}</td>
            <td>{w.weddingLocation}</td>
            <td>{w.weddingBudget}</td>
        </tr>
    ));

    return (
        <table>
            <thead>
                <th>Wedding ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Budget</th>
            </thead>
            <tbody>{tRows}</tbody>
        </table>
    );
}
