from odoo import http
from odoo.http import request
import json

class DocumentEditorController(http.Controller):

    @http.route('/document/editor/get', type='json', auth='user')
    def get_document_content(self, document_id):
        """Get document content for editing"""
        document = request.env['documents.document'].browse(int(document_id))
        if not document.exists():
            return {'error': 'Document not found'}
        
        return {
            'success': True,
            'content': document.text_content or '',
            'name': document.name,
            'mimetype': document.mimetype,
            'is_editable': document.is_text_editable,
        }

    @http.route('/document/editor/save', type='json', auth='user')
    def save_document_content(self, document_id, content):
        """Save edited document content"""
        document = request.env['documents.document'].browse(int(document_id))
        if not document.exists():
            return {'error': 'Document not found'}
        
        try:
            document.text_content = content
            return {
                'success': True,
                'message': 'Document saved successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }