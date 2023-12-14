import io

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph


def write_pdf(entries, prompts):
    # Create a BytesIO object to store the PDF
    output = io.BytesIO()

    # Create a PDF document
    c = canvas.Canvas(output, pagesize=letter)

    # Define the width and height for the text box
    width, height = letter

    # Set up the starting position for the text
    x, y = 50, height - 50

    # Create a ParagraphStyle for justified text
    justified_normal = ParagraphStyle(
        name='JustifyNormal',
        fontName='Times-Roman',
        fontSize=12,
        alignment=4  # 4 represents 'Justify'
    )
    justified_bold = ParagraphStyle(
        name='JustifyBold',
        fontName='Times-Bold',
        fontSize=12,
        alignment=4  # 4 represents 'Justify'
    )

    # styles = getSampleStyleSheet()
    # justified_style = styles["BodyText"]
    # justified_style.alignment = 4  # 4 represents 'Justify'

    # Write prompts and entries in the PDF
    c.setFont("Times-Roman", 12)
    for prompt, entry in zip(prompts, entries):
        if prompt:
            c.setFont("Times-Bold", 12)
            x, y = add_lines(prompt, justified_bold, c, x, y, width, height)
            # y -= 10
            c.setFont("Times-Roman", 12)
        x, y = add_lines(entry, justified_normal, c, x, y, width, height)
        # y -= 30


    # Save the PDF content
    c.save()
    output.seek(0)

    return output


def write_docx(entries, prompts):
    return 'hello'


def write_txt(entries, prompts):
    # Create the content for the text file
    content = ''
    for prompt, entry in zip(prompts, entries):
        content += (prompt + '\n') if prompt else ''
        content += entry + '\n\n'

    # Create a BytesIO object to store the text file
    output = io.BytesIO()
    output.write(content.encode('utf-8'))
    output.seek(0)

    return output


# Helper function to write lines in pdf's
def add_lines(text, style, c, x_start, y_start, width, height):
    x = x_start
    y = y_start

    # Split the text into paragraphs based on newline characters
    paragraphs = text.split('\n')

    # Create a Paragraph object for each paragraph and handle page breaks
    for paragraph in paragraphs:
        # Skip empty paragraphs
        if not paragraph.strip():
            continue
        
        # Create a Paragraph object with the text and the justified style
        p = Paragraph(paragraph, style)

        # Calculate the space left on the page
        space_left = y - 50  # margin at the bottom of the page
        text_height = p.wrap(width - 100, space_left)[1]

        # Check if there's enough space for the current paragraph
        if text_height > space_left:
            c.showPage()
            # c.setFont(font_name, font_size)  # Restore font and size
            y = height - 50  # Reset y position

        p.drawOn(c, x, y - text_height)  # Draw the paragraph on the canvas
        y -= text_height + 10  # Adjust vertical position for the next paragraph

    return x, y