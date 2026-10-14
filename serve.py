"""MedScope launcher — start the demo with a single command.

Run:
    python serve.py          (or: py serve.py)

Then open the address it prints (your browser opens automatically).
Stop it with Ctrl+C.

Only Python standard library is used — nothing to install.
Serves the files in this folder so Upload / Analysis / Results can
share images through the browser while you click through pages.
"""

import functools
import http.server
import os
import socketserver
import sys
import webbrowser

# First page of the demo flow.
START_PAGE = "login.html"

# Try these ports in order, so a busy port never blocks the demo.
PORTS = range(8000, 8010)


def find_server(project_dir):
    """Return (server, port) for the first free port, serving project_dir."""
    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler, directory=project_dir
    )
    for port in PORTS:
        try:
            server = socketserver.TCPServer(("127.0.0.1", port), handler)
            return server, port
        except OSError:
            continue  # port busy — try the next one
    print("All ports 8000-8009 are busy. Close something and try again.")
    sys.exit(1)


def main():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    server, port = find_server(project_dir)
    url = "http://localhost:{}/{}".format(port, START_PAGE)
    print("MedScope is running at " + url)
    print("Press Ctrl+C to stop.")
    try:
        webbrowser.open(url)
    except Exception:
        pass  # browser failed — the address above still works manually
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nMedScope stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
