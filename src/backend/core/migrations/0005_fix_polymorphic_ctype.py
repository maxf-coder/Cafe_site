from django.db import migrations


def fix_polymorphic_ctype(apps, schema_editor):
    PageSection = apps.get_model("core", "PageSection")
    ContentType = apps.get_model("contenttypes", "ContentType")

    for child_name in ["WideImageSection", "VideoSection", "TightImageSection", "ReelsSection"]:
        ChildModel = apps.get_model("core", child_name)
        ctype, _ = ContentType.objects.get_or_create(
            app_label="core", model=child_name.lower(),
        )
        child_ids = ChildModel.objects.values_list("pagesection_ptr_id", flat=True)
        PageSection.objects.filter(
            id__in=child_ids,
            polymorphic_ctype__isnull=True,
        ).update(polymorphic_ctype=ctype)


class Migration(migrations.Migration):
    dependencies = [("core", "0004_pagesection_polymorphic_ctype")]

    operations = [
        migrations.RunPython(fix_polymorphic_ctype, migrations.RunPython.noop),
    ]
