ALTER TABLE "categories" DROP CONSTRAINT "categories_landing_selection_consistent";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_landing_selection_consistent" CHECK (
      ("categories"."show_on_landing" = true and "categories"."landing_order" is not null and "categories"."landing_order" between 1 and 4)
      or ("categories"."show_on_landing" = false and "categories"."landing_order" is null)
    );