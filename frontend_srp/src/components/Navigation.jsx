import { Link } from "react-router-dom"

export function Navigation() {
    return (
        <div>
            <h1>Admin Navigation</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/admin/users">Users</Link>
                    </li>
                    <li>
                        <Link to="/settings">Settings</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}