export default function ExpenseTable(array) {
    const expArray = array.props || [];

    const expTable = expArray.map((e) => (
        <tr>
            <td>{e.expenseID}</td>
            <td>{e.expenseReason}</td>
            <td>{e.expenseAmount}</td>
            <td>{e.weddingID}</td>
        </tr>
    ));

    return (
        <table>
            <thead>
                <th>Expense ID</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Wedding ID</th>
            </thead>
            <tbody>{expTable}</tbody>
        </table>
    );
}
