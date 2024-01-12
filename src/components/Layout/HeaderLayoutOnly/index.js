import Header from "~/components/Layout/component/Header";

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <div className="container">
                <div className="contain">{children}</div>
            </div>
        </div>
    )
}

export default DefaultLayout;