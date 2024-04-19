import "./Files.css"

function Files({files}) {
    return (
        <div className="files">
            {files.map(file => <span key={file}>{file}</span>)}
        </div>
    )
}

export default Files;