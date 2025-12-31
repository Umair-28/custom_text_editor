{
    "name": "Custom Document Editor",
    "version": "18.0.1.0.0",
    "category": "Productivity/Documents",
    "summary": "Edit TXT and DOCX files directly in Odoo",
    "description": """
        Custom Document Editor
        ======================
        - Edit text files directly in Odoo
        - Convert and edit DOCX files
        - Save changes back to documents
    """,
    "depends": ["documents", "web"],
    "data": [
        "views/documents_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "odoo_text_editor/static/src/js/document_editor.js",
            "odoo_text_editor/static/src/xml/document_editor.xml",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
    "license": "LGPL-3",
}
